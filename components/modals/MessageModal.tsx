
import React, { useState, useEffect } from 'react';
import { Client, Loan, Installment } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { generateCollectionMessage } from '../../services/geminiService';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  loan: Loan;
  installment: Installment;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, client, loan, installment }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
        fetchMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchMessage = async () => {
    setIsLoading(true);
    setIsCopied(false);
    const msg = await generateCollectionMessage(client, loan, installment);
    setMessage(msg);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Collection Assistant">
      <div className="message-modal-body">
        <p style={{color: 'var(--color-slate-500)', marginBottom: '1rem', fontSize: '0.9rem'}}>
            AI-drafted message based on client risk score <strong>({client.riskScore})</strong> and payment status.
        </p>

        <div className="phone-preview">
            <div className="phone-preview-header">
                <div className="phone-dot"></div>
                <div className="phone-speaker"></div>
            </div>
            <div className="phone-screen">
                {isLoading ? (
                    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '0.5rem'}}>
                        <Spinner size="sm" />
                        <span style={{fontSize: '0.75rem', color: 'var(--color-slate-400)'}}>Drafting message...</span>
                    </div>
                ) : (
                    <div className="message-bubble">
                        {message}
                        <div className="message-time">Now</div>
                    </div>
                )}
            </div>
        </div>

        <div className="modal-footer" style={{marginTop: '1.5rem', padding: 0, border: 'none', background: 'transparent'}}>
          <Button variant="secondary" onClick={fetchMessage} disabled={isLoading} size="sm">
            Regenerate
          </Button>
          <div style={{flex: 1}}></div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={handleCopy} disabled={isLoading}>
            {isCopied ? 'Copied!' : 'Copy Text'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;
