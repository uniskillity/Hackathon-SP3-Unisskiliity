
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Client, Loan, RiskScore, UserRole } from '../types';
import Card from './ui/Card';

interface DashboardProps {
  clients: Client[];
  loans: Loan[];
  onRunDailyBatch: () => void;
  userRole?: UserRole;
}

const COLORS: { [key in RiskScore]: string } = {
  Low: '#10B981',    // Emerald 500
  Medium: '#F59E0B', // Amber 500
  High: '#EF4444',   // Red 500
};

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode, trend?: string, colorClass: string }> = ({ title, value, icon, trend, colorClass }) => (
    <Card>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-500)', marginBottom: '0.25rem' }}>{title}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)', letterSpacing: '-0.02em' }}>{value}</p>
                {trend && <p style={{ fontSize: '0.8rem', color: 'var(--color-success-text)', marginTop: '0.25rem' }}>{trend}</p>}
            </div>
            <div style={{ 
                padding: '1rem', 
                borderRadius: '1rem', 
                backgroundColor: `var(${colorClass})`, 
                color: 'white',
                boxShadow: 'var(--shadow-md)'
            }}>
                {icon}
            </div>
        </div>
    </Card>
);

const LoanDisbursementChart: React.FC<{ loans: Loan[] }> = ({ loans }) => {
    const data = useMemo(() => {
        const monthlyData: { [key: string]: number } = {};
        loans.forEach(loan => {
            const month = new Date(loan.startDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            monthlyData[month] = (monthlyData[month] || 0) + loan.amount;
        });
        
        return Object.entries(monthlyData)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => new Date(`1 ${a.name}`).getTime() - new Date(`1 ${b.name}`).getTime());
    }, [loans]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-slate-200)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-slate-500)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-slate-500)', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--color-primary-600)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

const OfficerPerformance: React.FC<{ loans: Loan[] }> = ({ loans }) => {
    const performanceData = useMemo(() => {
        const officerStats: { [key: string]: { totalLoans: number, totalDisbursed: number, active: number, defaulted: number } } = {};
        loans.forEach(loan => {
            const officer = loan.assignedOfficer || 'Unassigned';
            if (!officerStats[officer]) {
                officerStats[officer] = { totalLoans: 0, totalDisbursed: 0, active: 0, defaulted: 0 };
            }
            const stats = officerStats[officer];
            stats.totalLoans++;
            stats.totalDisbursed += loan.amount;
            if (loan.status === 'Active') stats.active++;
            if (loan.status === 'Defaulted') stats.defaulted++;
        });
        return Object.entries(officerStats).map(([name, stats]) => ({ name, ...stats }));
    }, [loans]);

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Officer</th>
                        <th>Total Loans</th>
                        <th>Disbursed</th>
                        <th>Active</th>
                        <th>Defaulted</th>
                    </tr>
                </thead>
                <tbody>
                    {performanceData.map(officer => (
                        <tr key={officer.name}>
                            <td style={{fontWeight: 600, color: 'var(--color-slate-900)'}}>{officer.name}</td>
                            <td>{officer.totalLoans}</td>
                            <td>PKR {officer.totalDisbursed.toLocaleString()}</td>
                            <td>
                                <span className="badge badge-active">{officer.active}</span>
                            </td>
                            <td>
                                {officer.defaulted > 0 ? (
                                     <span className="badge badge-defaulted">{officer.defaulted}</span>
                                ) : (
                                    <span style={{color: 'var(--color-slate-400)'}}>-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ clients, loans, onRunDailyBatch, userRole }) => {

  const totalClients = clients.length;
  const activeLoans = loans.filter(loan => loan.status === 'Active').length;
  const completedLoans = loans.filter(loan => loan.status === 'Completed').length;
  const defaultedLoans = loans.filter(loan => loan.status === 'Defaulted').length;


  const riskDistribution = useMemo(() => {
    const counts: { [key in RiskScore]: number } = { Low: 0, Medium: 0, High: 0 };
    clients.forEach(client => {
      counts[client.riskScore]++;
    });
    return [
      { name: 'Low Risk', value: counts.Low },
      { name: 'Medium Risk', value: counts.Medium },
      { name: 'High Risk', value: counts.High },
    ].filter(item => item.value > 0);
  }, [clients]);
  
  const handleExportReport = () => {
      const headers = ['Client ID', 'Name', 'CNIC', 'Risk Score', 'Loan ID', 'Loan Type', 'Amount', 'Status', 'Outstanding Balance'];
      
      const rows = loans.map(loan => {
          const client = clients.find(c => c.id === loan.clientId);
          const outstanding = loan.amount - loan.schedule.reduce((sum, inst) => sum + (inst.paidAmount || 0), 0);
          
          // Helper to safely escape CSV fields
          const escape = (val: string | number | undefined) => {
              const str = String(val || '');
              // If contains comma, quote or newline, wrap in quotes and escape existing quotes
              if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                  return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
          };

          return [
              escape(client?.id),
              escape(client?.name || 'Unknown'),
              escape(client?.cnic),
              escape(client?.riskScore),
              escape(loan.id),
              escape(loan.type),
              escape(loan.amount),
              escape(loan.status),
              escape(outstanding)
          ].join(',');
      });
      
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `mlms_portfolio_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center dashboard-header">
            <div>
                <h2 className="page-title">Overview</h2>
                <p style={{color: 'var(--color-slate-500)'}}>Here's what's happening with your loan portfolio today.</p>
            </div>
            <div className="dashboard-actions">
                {userRole === 'Admin' && (
                    <button className="btn btn-primary btn-sm" onClick={onRunDailyBatch}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width:'1.25rem', height:'1.25rem'}}>
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Run Daily Processing
                    </button>
                )}
                <button className="btn btn-secondary btn-sm" onClick={handleExportReport}>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width:'1.25rem', height:'1.25rem'}}>
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                     Export Report
                </button>
            </div>
       </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem'}}>
        <StatCard title="Total Clients" value={totalClients} icon={<UsersIcon />} trend="+12% vs last month" colorClass="--color-primary-500" />
        <StatCard title="Active Loans" value={activeLoans} icon={<TrendingUpIcon />} trend="+5% vs last month" colorClass="--color-primary-500" />
        <StatCard title="Completed" value={completedLoans} icon={<CheckCircleIcon />} colorClass="--color-success-text" />
        <StatCard title="Defaulted" value={defaultedLoans} icon={<ExclamationCircleIcon />} colorClass="--color-danger-text" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem'}}>
        <Card title="Loan Disbursement Trend">
            <div className="card-body">
                <LoanDisbursementChart loans={loans} />
            </div>
        </Card>
        <Card title="Client Risk Distribution">
          {riskDistribution.length > 0 ? (
            <div style={{height: 300, width: '100%'}}>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                    {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.split(' ')[0] as RiskScore]} strokeWidth={0} />
                    ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
                </ResponsiveContainer>
            </div>
          ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-slate-400)' }}>
                  <p>No client data available.</p>
              </div>
          )}
        </Card>
      </div>

       <Card title="Top Performing Officers">
            <div className="card-body" style={{padding: 0}}>
              <OfficerPerformance loans={loans} />
            </div>
       </Card>
    </div>
  );
};

// SVG Icons
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1.5rem', width: '1.5rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197m-3-5.197a4 4 0 11-8 0" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1.5rem', width: '1.5rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1.5rem', width: '1.5rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ExclamationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" style={{height: '1.5rem', width: '1.5rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

export default Dashboard;
