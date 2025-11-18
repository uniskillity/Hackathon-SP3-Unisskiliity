import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Client, Loan, RiskScore } from '../types';
import Card from './ui/Card';

interface DashboardProps {
  clients: Client[];
  loans: Loan[];
}

const COLORS: { [key in RiskScore]: string } = {
  Low: '#10B981',    // Emerald 500
  Medium: '#F59E0B', // Amber 500
  High: '#EF4444',   // Red 500
};

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem', borderRadius: '9999px', backgroundColor: 'var(--color-teal-100)', color: 'var(--color-teal-600)', marginRight: '1rem' }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-500)' }}>{title}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>{value}</p>
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
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="amount" name="Disbursed Amount" stroke="#0D9488" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
};

const OfficerPerformance: React.FC<{ loans: Loan[] }> = ({ loans }) => {
    const performanceData = useMemo(() => {
        const officerStats: { [key: string]: { totalLoans: number, totalDisbursed: number, active: number, defaulted: number } } = {};
        loans.forEach(loan => {
            if (!officerStats[loan.assignedOfficer]) {
                officerStats[loan.assignedOfficer] = { totalLoans: 0, totalDisbursed: 0, active: 0, defaulted: 0 };
            }
            const stats = officerStats[loan.assignedOfficer];
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
                            <td style={{fontWeight: 500, color: 'var(--color-gray-900)'}}>{officer.name}</td>
                            <td>{officer.totalLoans}</td>
                            <td>PKR {officer.totalDisbursed.toLocaleString()}</td>
                            <td>{officer.active}</td>
                            <td style={{color: 'var(--color-red-600)', fontWeight: 500}}>{officer.defaulted}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ clients, loans }) => {

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

  return (
    <div className="space-y-6">
       <h2 className="page-title">Dashboard Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem'}}>
        <StatCard title="Total Clients" value={totalClients} icon={<UsersIcon />} />
        <StatCard title="Active Loans" value={activeLoans} icon={<TrendingUpIcon />} />
        <StatCard title="Completed Loans" value={completedLoans} icon={<CheckCircleIcon />} />
        <StatCard title="Defaulted Loans" value={defaultedLoans} icon={<ExclamationCircleIcon />} />
      </div>
      
      {/* FIX: The 'lg' property is not a valid CSS property for inline styles. Replaced with a responsive grid layout using 'auto-fit' and 'minmax' to achieve a similar responsive behavior. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem'}}>
        <Card title="Client Risk Distribution">
          {riskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.split(' ')[0] as RiskScore]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-gray-500)' }}>
                  <p>No client data available to display risk distribution.</p>
              </div>
          )}
        </Card>
        <Card title="Loan Disbursement Trend">
            <div className="card-body">
                <LoanDisbursementChart loans={loans} />
            </div>
        </Card>
      </div>

       <Card title="Officer Performance">
            <div className="card-body">
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