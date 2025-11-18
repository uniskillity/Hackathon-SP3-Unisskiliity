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
    <div className="alert alert-info" style={{marginTop: '1rem'}}>
      <div>
        <h5 className="alert-title" style={{marginBottom: '0.5rem'}}>AI Default Prediction</h5>
        {isLoading ? (
          <div className="flex items-center" style={{gap: '0.5rem'}}>
            <Spinner size="sm" />
            <span>Calculating risk...</span>
          </div>
        ) : prediction ? (
          <div className="flex items-center" style={{gap: '0.75rem'}}>
            <Badge type={prediction.predictionLabel} />
            <p style={{color: 'var(--color-gray-700)', fontWeight: 600}}>{prediction.predictionPercentage}% chance of default</p>
          </div>
        ) : (
          <p>Could not retrieve prediction.</p>
        )}
      </div>
    </div>
  );
};

export default AIDefaultPrediction;
