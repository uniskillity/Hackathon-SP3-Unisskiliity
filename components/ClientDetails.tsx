import React, { useState, lazy, Suspense } from 'react';
import { Client, Loan, InstallmentStatus } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import LoanCard from './LoanCard';

const EditLoanModal = lazy(() => import('./modals/EditLoanModal'));

interface ClientDetailsProps {
  client: Client;
  loans: Loan[];
  onAddLoan: () => void;
  onUpdatePayment: (loanId: string, installmentId: string, newStatus: InstallmentStatus, paidAmount?: number) => void;
  onUpdateLoanStatus: (loanId: string, newStatus: 'Defaulted' | 'Completed') => void;
  onEditLoan: (loan: Loan) => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, loans, onAddLoan, onUpdatePayment, onUpdateLoanStatus, onEditLoan }) => {
  const [editModalState, setEditModalState] = useState<{ isOpen: boolean, loan: Loan | null }>({ isOpen: false, loan: null });

  const handleOpenEditModal = (loan: Loan) => {
    setEditModalState({ isOpen: true, loan });
  };
  
  const handleCloseEditModal = () => {
    setEditModalState({ isOpen: false, loan: null });
  };

  return (
    <div className="space-y-6">
      <Card title="Client Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2 flex justify-between items-start">
                <div>
                    <h4 className="text-2xl font-bold text-gray-800">{client.name}</h4>
                    <p className="text-gray-600">{client.cnic}</p>
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium text-gray-500">Risk Score</span>
                    <div><Badge type={client.riskScore} /></div>
                </div>
            </div>
            <div><p className="text-sm font-medium text-gray-500">Phone</p><p>{client.phone}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Address</p><p>{client.address}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Monthly Income</p><p>{client.income ? `PKR ${client.income.toLocaleString()}` : 'N/A'}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Occupation</p><p>{client.occupation || 'N/A'}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Household Size</p><p>{client.householdSize || 'N/A'}</p></div>
            {client.documents && client.documents.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-gray-500">Documents</p>
                    <ul className="list-disc list-inside text-sm">
                        {client.documents.map(d => <li key={d.fileName}>{d.fileName}</li>)}
                    </ul>
                </div>
            )}
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-700">Loans</h3>
        <Button onClick={onAddLoan}>+ Add New Loan</Button>
      </div>

      {loans.length > 0 ? (
        <div className="space-y-4">
          {loans.map(loan => (
            <LoanCard 
                key={loan.id}
                client={client}
                loan={loan}
                onUpdatePayment={onUpdatePayment}
                onUpdateLoanStatus={onUpdateLoanStatus}
                onOpenEditModal={handleOpenEditModal}
            />
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500">This client has no active or past loans.</p>
        </Card>
      )}
      
      <Suspense fallback={null}>
        {editModalState.isOpen && editModalState.loan && (
          <EditLoanModal 
            isOpen={editModalState.isOpen}
            onClose={handleCloseEditModal}
            loan={editModalState.loan}
            onEditLoan={onEditLoan}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ClientDetails;
