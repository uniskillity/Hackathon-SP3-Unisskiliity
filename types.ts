
export type RiskScore = 'Low' | 'Medium' | 'High';
export type LoanStatus = 'Active' | 'Completed' | 'Defaulted';
export type InstallmentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
export type DefaultPredictionLabel = 'Low' | 'Moderate' | 'High';

export interface ClientDocument {
  fileName: string;
  fileType: string;
  uploadDate: string;
}

export interface Client {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  address: string;
  riskScore: RiskScore;
  joinDate: string;
  // New optional fields
  income?: number;
  occupation?: string;
  householdSize?: number;
  documents?: ClientDocument[];
}

export interface Installment {
  id: string;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  paidAmount?: number;
  paymentDate?: string;
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
  // New fields
  interestRate: number;
  assignedOfficer: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  CLIENT_DETAILS = 'CLIENT_DETAILS',
  ARCHITECTURE = 'ARCHITECTURE',
}

export interface DefaultPrediction {
  predictionLabel: DefaultPredictionLabel;
  predictionPercentage: number;
}
