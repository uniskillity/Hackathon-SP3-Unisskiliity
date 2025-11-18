import React, { useState, useEffect } from 'react';
import { Installment, InstallmentStatus } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface UpdatePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    installment: Installment;
    loanId: string;
    onUpdate: (loanId: string, installmentId: string, newStatus: InstallmentStatus, paidAmount?: number) => void;
}

const UpdatePaymentModal: React.FC<UpdatePaymentModalProps> = ({ isOpen, onClose, installment, loanId, onUpdate }) => {
    const [status, setStatus] = useState<InstallmentStatus>(installment.status);
    const [paidAmount, setPaidAmount] = useState(installment.paidAmount?.toString() || '');
    const [error, setError] = useState('');

    useEffect(() => {
        setStatus(installment.status);
        setPaidAmount(installment.paidAmount?.toString() || '');
        setError(''); // Reset error when modal opens or installment changes
    }, [installment]);

    const handleAmountChange = (value: string) => {
        setPaidAmount(value);
        if (error) setError(''); // Clear error on input change
    };

    const handleSubmit = () => {
        if (status === 'Partially Paid') {
            const numAmount = Number(paidAmount);
            if (isNaN(numAmount) || numAmount <= 0 || numAmount >= installment.amount) {
                setError('Partial amount must be greater than 0 and less than the installment amount.');
                return;
            }
        }
        onUpdate(loanId, installment.id, status, status === 'Partially Paid' ? Number(paidAmount) : undefined);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Update Payment for Due Date: ${installment.dueDate}`}>
            <div className="space-y-4">
                <p><strong>Amount Due:</strong> PKR {installment.amount.toLocaleString()}</p>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as InstallmentStatus)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
                {status === 'Partially Paid' && (
                    <div>
                        <Input id="paidAmount" label={`Amount Paid (Max: ${installment.amount})`} type="number" value={paidAmount} onChange={e => handleAmountChange(e.target.value)} required />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                )}
                <div className="flex justify-end pt-4 space-x-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>

                    <Button onClick={handleSubmit}>Update Payment</Button>
                </div>
            </div>
        </Modal>
    );
}

export default UpdatePaymentModal;
