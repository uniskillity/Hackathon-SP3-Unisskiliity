import React, { useState } from 'react';
import { Client, Loan, Installment, InstallmentStatus } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import AIDefaultPrediction from './AIDefaultPrediction';
import UpdatePaymentModal from './modals/UpdatePaymentModal';

interface LoanCardProps {
    client: Client;
    loan: Loan;
    onUpdatePayment: (loanId: string, installmentId: string, newStatus: InstallmentStatus, paidAmount?: number) => void;
    onUpdateLoanStatus: (loanId: string, newStatus: 'Defaulted' | 'Completed') => void;
    onOpenEditModal: (loan: Loan) => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ client, loan, onUpdatePayment, onUpdateLoanStatus, onOpenEditModal }) => {
    const [paymentModalState, setPaymentModalState] = useState<{ isOpen: boolean, installment: Installment | null }>({ isOpen: false, installment: null });
    
    const remainingBalance = loan.amount - loan.schedule.reduce((sum, inst) => sum + (inst.paidAmount || 0), 0);

    const handleOpenPaymentModal = (installment: Installment) => {
        setPaymentModalState({ isOpen: true, installment });
    };

    const handleClosePaymentModal = () => {
        setPaymentModalState({ isOpen: false, installment: null });
    };

    return (
        <Card>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-lg font-semibold">{`Loan #${loan.id.slice(-4)} - ${loan.type}`}</h4>
                    <p className="text-sm text-gray-500">Officer: {loan.assignedOfficer} | Rate: {loan.interestRate}%</p>
                </div>
                <Badge type={loan.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded-md">
                <div><p className="text-sm font-medium text-gray-500">Principal</p><p className="font-semibold text-lg">PKR {loan.amount.toLocaleString()}</p></div>
                <div><p className="text-sm font-medium text-gray-500">Remaining Balance</p><p className="font-semibold text-lg text-teal-600">PKR {remainingBalance.toLocaleString()}</p></div>
            </div>

            <AIDefaultPrediction client={client} loan={loan} />

            <h4 className="font-semibold mb-2 mt-4">Repayment Schedule</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loan.schedule.map(inst => (
                            <tr key={inst.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{inst.dueDate}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">PKR {inst.amount.toLocaleString()}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm"><Badge type={inst.status} /></td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                    {loan.status === 'Active' && (
                                        <button onClick={() => handleOpenPaymentModal(inst)} className="text-sm font-medium text-teal-600 hover:text-teal-800">
                                            Update Payment
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {loan.schedule.some(i => i.status === 'Overdue') && loan.status === 'Active' &&
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    <strong>Default Alert:</strong> This client has one or more overdue payments.
                </div>
            }
            {loan.status === 'Active' && (
                <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => onOpenEditModal(loan)}>Edit Loan</Button>
                    <Button variant="secondary" size="sm" className="!bg-red-100 !text-red-800 hover:!bg-red-200 focus:!ring-red-400" onClick={() => onUpdateLoanStatus(loan.id, 'Defaulted')}>Mark as Defaulted</Button>
                </div>
            )}

            {paymentModalState.isOpen && paymentModalState.installment && (
                <UpdatePaymentModal
                    isOpen={paymentModalState.isOpen}
                    onClose={handleClosePaymentModal}
                    installment={paymentModalState.installment}
                    loanId={loan.id}
                    onUpdate={onUpdatePayment}
                />
            )}
        </Card>
    );
};

export default LoanCard;
