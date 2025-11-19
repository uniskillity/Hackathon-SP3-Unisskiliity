
import React, { useState } from 'react';
import { Client, Loan, Installment, InstallmentStatus } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import AIDefaultPrediction from './AIDefaultPrediction';
import UpdatePaymentModal from './modals/UpdatePaymentModal';
import MessageModal from './modals/MessageModal';

interface LoanCardProps {
    client: Client;
    loan: Loan;
    onUpdatePayment: (loanId: string, installmentId: string, newStatus: InstallmentStatus, paidAmount?: number) => void;
    onUpdateLoanStatus: (loanId: string, newStatus: 'Defaulted' | 'Completed') => void;
    onOpenEditModal: (loan: Loan) => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ client, loan, onUpdatePayment, onUpdateLoanStatus, onOpenEditModal }) => {
    const [paymentModalState, setPaymentModalState] = useState<{ isOpen: boolean, installment: Installment | null }>({ isOpen: false, installment: null });
    const [messageModalState, setMessageModalState] = useState<{ isOpen: boolean, installment: Installment | null }>({ isOpen: false, installment: null });
    
    const remainingBalance = loan.amount - loan.schedule.reduce((sum, inst) => sum + (inst.paidAmount || 0), 0);

    const handleOpenPaymentModal = (installment: Installment) => {
        setPaymentModalState({ isOpen: true, installment });
    };

    const handleClosePaymentModal = () => {
        setPaymentModalState({ isOpen: false, installment: null });
    };

    const handleOpenMessageModal = (installment: Installment) => {
        setMessageModalState({ isOpen: true, installment });
    };

    const handleCloseMessageModal = () => {
        setMessageModalState({ isOpen: false, installment: null });
    };

    return (
        <Card>
            <div className="card-body">
                <div className="flex justify-between items-start" style={{marginBottom: '0.5rem'}}>
                    <div>
                        <h4 style={{fontSize: '1.125rem', fontWeight: 600}}>{`Loan #${loan.id.slice(-4)} - ${loan.type}`}</h4>
                        <p style={{fontSize: '0.875rem', color: 'var(--color-gray-500)'}}>Officer: {loan.assignedOfficer} | Rate: {loan.interestRate}%</p>
                    </div>
                    <Badge type={loan.status} />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem', backgroundColor: 'var(--color-gray-50)', padding: '0.75rem', borderRadius: 'var(--border-radius-md)'}}>
                    <div>
                        <p style={{fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-500)'}}>Principal</p>
                        <p style={{fontWeight: 600, fontSize: '1.25rem'}}>PKR {loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                        <p style={{fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-500)'}}>Remaining Balance</p>
                        <p style={{fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-teal-600)'}}>PKR {remainingBalance.toLocaleString()}</p>
                    </div>
                </div>

                <AIDefaultPrediction client={client} loan={loan} />

                <h4 style={{fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem'}}>Repayment Schedule</h4>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Due Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loan.schedule.map(inst => (
                                <tr key={inst.id}>
                                    <td>{inst.dueDate}</td>
                                    <td>PKR {inst.amount.toLocaleString()}</td>
                                    <td><Badge type={inst.status} /></td>
                                    <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                                        {loan.status === 'Active' && (
                                            <>
                                            <button onClick={() => handleOpenPaymentModal(inst)} className="action-btn text-teal" title="Update Payment">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            {(inst.status === 'Pending' || inst.status === 'Overdue') && (
                                                <button onClick={() => handleOpenMessageModal(inst)} className="action-btn text-blue" title="Draft AI Reminder">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                </button>
                                            )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loan.schedule.some(i => i.status === 'Overdue') && loan.status === 'Active' &&
                    <div className="alert alert-danger" style={{marginTop: '1rem'}}>
                        <strong>Default Alert:</strong> This client has one or more overdue payments.
                    </div>
                }
                {loan.status === 'Active' && (
                    <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
                        <Button variant="secondary" size="sm" onClick={() => onOpenEditModal(loan)}>Edit Loan</Button>
                        <Button variant="secondary" size="sm" className="btn-danger" onClick={() => onUpdateLoanStatus(loan.id, 'Defaulted')}>Mark as Defaulted</Button>
                    </div>
                )}
            </div>

            {paymentModalState.isOpen && paymentModalState.installment && (
                <UpdatePaymentModal
                    isOpen={paymentModalState.isOpen}
                    onClose={handleClosePaymentModal}
                    installment={paymentModalState.installment}
                    loanId={loan.id}
                    onUpdate={onUpdatePayment}
                />
            )}

            {messageModalState.isOpen && messageModalState.installment && (
                <MessageModal
                    isOpen={messageModalState.isOpen}
                    onClose={handleCloseMessageModal}
                    client={client}
                    loan={loan}
                    installment={messageModalState.installment}
                />
            )}
        </Card>
    );
};

export default LoanCard;
