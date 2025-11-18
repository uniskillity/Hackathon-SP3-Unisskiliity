import React from 'react';
import { RiskScore, InstallmentStatus, DefaultPredictionLabel, LoanStatus } from '../../types';

interface BadgeProps {
  type: RiskScore | InstallmentStatus | LoanStatus | DefaultPredictionLabel;
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const typeClassName = type.toLowerCase().replace(' ', '-');
  const className = `badge badge-${typeClassName}`;

  return (
    <span className={className}>
      {type}
    </span>
  );
};

export default Badge;
