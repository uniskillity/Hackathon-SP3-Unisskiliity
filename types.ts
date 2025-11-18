export type RiskScore = 'Low' | 'Medium' | 'High';
export type LoanStatus = 'Active' | 'Completed';
export type InstallmentStatus = 'Paid' | 'Pending' | 'Overdue';
export type DefaultPredictionLabel = 'Low' | 'Moderate' | 'High';

export interface Client {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  address: string;
  riskScore: RiskScore;
  joinDate: string;
}

export interface Installment {
  id: string;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
}

export interface Loan {
  id: string;
  clientId: string;
  amount: number;
  type: string;
  durationMonths: number;
  startDate: string;
  status: LoanStatus;
  schedule: Installment[];
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  CLIENT_DETAILS = 'CLIENT_DETAILS',
}

export interface DefaultPrediction {
  predictionLabel: DefaultPredictionLabel;
  predictionPercentage: number;
}
