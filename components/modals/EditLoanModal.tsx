import React, { useState, useMemo } from 'react';
import { Loan } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { generateSchedule } from '../../utils/loanUtils';

const OFFICERS = ['Ali Raza', 'Fatima Jilani', 'Ahmed Cheema'];

interface EditLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan;
  onEditLoan: (loan: Loan) => void;
}

const EditLoanModal: React.FC<EditLoanModalProps> = ({ isOpen, onClose, loan, onEditLoan }) => {
  const [amount, setAmount] = useState(loan.amount.toString());
  const [type, setType] = useState(loan.type);
  const [duration, setDuration] = useState(loan.durationMonths.toString());
  const [interestRate, setInterestRate] = useState(loan.interestRate.toString());
  const [assignedOfficer, setAssignedOfficer] = useState(loan.assignedOfficer);
  const [error, setError] = useState('');

  const scheduleWillReset = useMemo(() => {
    return loan.amount !== parseInt(amount) || loan.durationMonths !== parseInt(duration);
  }, [loan, amount, duration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loanAmount = parseInt(amount);
    const durationMonths = parseInt(duration);
    const rate = parseFloat(interestRate);

    if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(durationMonths) || durationMonths <= 0 || isNaN(rate) || rate < 0) {
      setError('Please enter valid loan amount, duration, and interest rate.');
      return;
    }
    setError('');

    const updatedLoan: Loan = {
      ...loan,
      amount: loanAmount,
      type,
      durationMonths,
      interestRate: rate,
      assignedOfficer,
      schedule: scheduleWillReset ? generateSchedule(loanAmount, durationMonths, loan.startDate) : loan.schedule,
    };
    onEditLoan(updatedLoan);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Loan #${loan.id.slice(-4)}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {scheduleWillReset && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                <strong>Warning:</strong> Changing the amount or duration will reset the repayment schedule and clear all existing payment history for this loan.
            </div>
        )}
        <Input id="amount" label="Loan Amount (PKR)" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        <Input id="duration" label="Duration (Months)" type="number" value={duration} onChange={e => setDuration(e.target.value)} required />
        <Input id="interestRate" label="Interest Rate (%)" type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} required />
        <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
            <select id="type" value={type} onChange={e => setType(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                <option>Business</option>
                <option>Personal</option>
                <option>Emergency</option>
                <option>Education</option>
                <option>Agriculture</option>
            </select>
        </div>
         <div>
            <label htmlFor="officer" className="block text-sm font-medium text-gray-700 mb-1">Assigned Officer</label>
            <select id="officer" value={assignedOfficer} onChange={e => setAssignedOfficer(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                {OFFICERS.map(o => <option key={o}>{o}</option>)}
            </select>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-end pt-4 space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditLoanModal;
