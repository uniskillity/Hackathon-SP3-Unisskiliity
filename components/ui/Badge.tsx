
import React from 'react';
import { RiskScore, InstallmentStatus, DefaultPredictionLabel, LoanStatus } from '../../types';

interface BadgeProps {
  type: RiskScore | InstallmentStatus | LoanStatus | DefaultPredictionLabel;
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const styles: { [key: string]: string } = {
    // Risk Scores
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
    // Prediction Label
    Moderate: 'bg-orange-100 text-orange-800',
    // Installment Status
    Paid: 'bg-blue-100 text-blue-800',
    Pending: 'bg-gray-200 text-gray-800',
    Overdue: 'bg-orange-100 text-orange-800',
    'Partially Paid': 'bg-cyan-100 text-cyan-800',
    // Loan Status
    Active: 'bg-teal-100 text-teal-800',
    Completed: 'bg-indigo-100 text-indigo-800',
    Defaulted: 'bg-zinc-200 text-zinc-800',
  };

  const style = styles[type] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {type}
    </span>
  );
};

export default Badge;
