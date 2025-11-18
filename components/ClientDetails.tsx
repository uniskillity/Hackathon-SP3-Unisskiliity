import React, { useState, useEffect } from 'react';
import { Client, Loan, Installment, DefaultPrediction } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { getAIBasedDefaultPrediction } from '../services/geminiService';
import Spinner from './ui/Spinner';

interface ClientDetailsProps {
  client: Client;
  loans: Loan[];
  onAddLoan: () => void;
  onUpdatePayment: (loanId: string, installmentId: string, isPaid: boolean) => void;
}

const AIDefaultPrediction: React.FC<{ client: Client, loan: Loan }> = ({ client, loan }) => {
  const [prediction, setPrediction] = useState<DefaultPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      const result = await getAIBasedDefaultPrediction(client, loan);
      setPrediction(result);
      setIsLoading(false);
    };

    fetchPrediction();
  }, [client, loan]);

  return (
    <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
      <h5 className="text-sm font-semibold text-indigo-800 mb-2">AI Default Prediction</h5>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Spinner size="sm" />
          <span className="text-indigo-700 text-sm">Calculating risk...</span>
        </div>
      ) : prediction ? (
        <div className="flex items-center space-x-3">
          <Badge type={prediction.predictionLabel} />
          <p className="text-gray-700 font-semibold">{prediction.predictionPercentage}% chance of default</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Could not retrieve prediction.</p>
      )}
    </div>
  );
};


const ClientDetails: React.FC<ClientDetailsProps> = ({ client, loans, onAddLoan, onUpdatePayment }) => {

  const handlePaymentToggle = (loanId: string, installment: Installment) => {
    onUpdatePayment(loanId, installment.id, installment.status !== 'Paid');
  };

  return (
    <div className="space-y-6">
      <Card title="Client Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-2xl font-bold text-gray-800">{client.name}</h4>
            <p className="text-gray-600">{client.cnic}</p>
          </div>
          <div className="flex items-center md:justify-end">
            <span className="text-sm font-medium text-gray-500 mr-2">Risk Score:</span>
            <Badge type={client.riskScore} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p>{client.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p>{client.address}</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-700">Loans</h3>
        <Button onClick={onAddLoan}>+ Add New Loan</Button>
      </div>

      {loans.length > 0 ? (
        <div className="space-y-4">
          {loans.map(loan => (
            <Card key={loan.id} title={`Loan #${loan.id.slice(-4)} - ${loan.type}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xl font-semibold">PKR {loan.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{loan.durationMonths} months | Start: {loan.startDate}</p>
                </div>
                <Badge type={loan.status} />
              </div>

              {loan.status === 'Active' && <AIDefaultPrediction client={client} loan={loan} />}

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
                                <button 
                                    onClick={() => handlePaymentToggle(loan.id, inst)}
                                    className={`text-sm font-medium ${inst.status === 'Paid' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
                                >
                                    {inst.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                                </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
               {loan.status === 'Active' && new Date(loan.schedule.find(i => i.status === 'Overdue')?.dueDate ?? 0) < new Date() &&
                 <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    <strong>Default Alert:</strong> This client has one or more overdue payments.
                 </div>
               }
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500">This client has no active or past loans.</p>
        </Card>
      )}
    </div>
  );
};

export default ClientDetails;
