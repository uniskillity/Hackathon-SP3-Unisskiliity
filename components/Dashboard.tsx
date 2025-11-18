import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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

// Fix: Changed JSX.Element to React.ReactNode to resolve namespace error.
const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center">
        <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ clients, loans }) => {

  const totalClients = clients.length;
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => loan.status === 'Active').length;
  const completedLoans = loans.filter(loan => loan.status === 'Completed').length;

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
       <h2 className="text-2xl font-bold text-gray-700">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clients" value={totalClients} icon={<UsersIcon />} />
        <StatCard title="Total Loans" value={totalLoans} icon={<CollectionIcon />} />
        <StatCard title="Active Loans" value={activeLoans} icon={<TrendingUpIcon />} />
        <StatCard title="Completed Loans" value={completedLoans} icon={<CheckCircleIcon />} />
      </div>
      
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
            <div className="text-center py-12 text-gray-500">
                <p>No client data available to display risk distribution.</p>
            </div>
        )}
      </Card>
    </div>
  );
};

// SVG Icons
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197m-3-5.197a4 4 0 11-8 0" /></svg>;
const CollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default Dashboard;