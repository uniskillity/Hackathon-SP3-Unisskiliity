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

const ClientDetailItem: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
    <div>
        <p style={{fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-500)'}}>{label}</p>
        <p>{children}</p>
    </div>
);


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
        <div className="card-body">
            {/* FIX: The 'md' property is not a valid CSS property for inline styles. Replaced with a responsive grid layout using 'auto-fit' and 'minmax' to achieve a similar responsive behavior. */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem 1.5rem' }}>
                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h4 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-800)'}}>{client.name}</h4>
                        <p style={{color: 'var(--color-gray-600)'}}>{client.cnic}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <span style={{fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-500)'}}>Risk Score</span>
                        <div><Badge type={client.riskScore} /></div>
                    </div>
                </div>
                <ClientDetailItem label="Phone">{client.phone}</ClientDetailItem>
                <ClientDetailItem label="Address">{client.address}</ClientDetailItem>
                <ClientDetailItem label="Monthly Income">{client.income ? `PKR ${client.income.toLocaleString()}` : 'N/A'}</ClientDetailItem>
                <ClientDetailItem label="Occupation">{client.occupation || 'N/A'}</ClientDetailItem>
                <ClientDetailItem label="Household Size">{client.householdSize || 'N/A'}</ClientDetailItem>
                {client.documents && client.documents.length > 0 && (
                    <ClientDetailItem label="Documents">
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                            {client.documents.map(d => <li key={d.fileName}>{d.fileName}</li>)}
                        </ul>
                    </ClientDetailItem>
                )}
            </div>
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="page-title">Loans</h3>
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
            <div className="card-body">
                <p style={{ textAlign: 'center', color: 'var(--color-gray-500)'}}>This client has no active or past loans.</p>
            </div>
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