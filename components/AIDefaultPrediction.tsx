import React, { useState, useEffect } from 'react';
import { Client, Loan, DefaultPrediction } from '../types';
import Badge from './ui/Badge';
import Spinner from './ui/Spinner';
import { getAIBasedDefaultPrediction } from '../services/geminiService';

const AIDefaultPrediction: React.FC<{ client: Client, loan: Loan }> = ({ client, loan }) => {
  const [prediction, setPrediction] = useState<DefaultPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (loan.status !== 'Active') return;
      setIsLoading(true);
      const result = await getAIBasedDefaultPrediction(client, loan);
      setPrediction(result);
      setIsLoading(false);
    };

    fetchPrediction();
  }, [client, loan]);

  if (loan.status !== 'Active') return null;

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

export default AIDefaultPrediction;
