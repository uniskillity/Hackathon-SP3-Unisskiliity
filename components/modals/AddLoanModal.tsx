import React, { useState, useEffect, useCallback } from 'react';
import { Client, Loan, Installment } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { getLoanRecommendation } from '../../services/geminiService';
import { generateSchedule } from '../../utils/loanUtils';

const OFFICERS = ['Ali Raza', 'Fatima Jilani', 'Ahmed Cheema'];

interface AddLoanModalProps {
  client: Client;
  onClose: () => void;
  onAddLoan: (loan: Loan) => void;
}

const AddLoanModal: React.FC<AddLoanModalProps> = ({ client, onClose, onAddLoan }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Business');
  const [duration, setDuration] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState(OFFICERS[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isFetchingRecommendation, setIsFetchingRecommendation] = useState(false);

  const fetchRecommendation = useCallback(async () => {
    const loanAmount = parseInt(amount);
    const durationMonths = parseInt(duration);

    if (loanAmount > 0 && durationMonths > 0) {
      setIsFetchingRecommendation(true);
      const rec = await getLoanRecommendation(client.riskScore, loanAmount, durationMonths);
      setRecommendation(rec);
      setIsFetchingRecommendation(false);
    } else {
        setRecommendation('');
    }
  }, [amount, duration, client.riskScore]);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchRecommendation();
    }, 1000); // Debounce API call

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, duration, fetchRecommendation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (client.riskScore === 'High') {
        setError('Cannot create new loans for clients with a "High" risk score.');
        return;
    }

    const loanAmount = parseInt(amount);
    const durationMonths = parseInt(duration);
    const rate = parseFloat(interestRate);

    if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(durationMonths) || durationMonths <= 0 || isNaN(rate) || rate < 0) {
      setError('Please enter valid loan amount, duration, and interest rate.');
      return;
    }
    setError('');

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      clientId: client.id,
      amount: loanAmount,
      type,
      durationMonths,
      startDate,
      status: 'Active',
      schedule: generateSchedule(loanAmount, durationMonths, startDate),
      interestRate: rate,
      assignedOfficer,
    };
    onAddLoan(newLoan);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`New Loan for ${client.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {client.riskScore === 'High' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                <strong>Warning:</strong> This client has a high risk score. Loan creation is disabled.
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
        <Input id="startDate" label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />

        { (recommendation || isFetchingRecommendation) && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md flex items-start space-x-3">
                <div className="text-indigo-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-indigo-800">AI Recommendation</h4>
                    {isFetchingRecommendation ? <div className="flex items-center space-x-2"><Spinner size="sm" /><span className="text-indigo-700 text-sm">Analyzing...</span></div> : <p className="text-indigo-700 text-sm">{recommendation}</p>}
                </div>
            </div>
        )}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-end pt-4 space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={client.riskScore === 'High'}>Create Loan</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLoanModal;