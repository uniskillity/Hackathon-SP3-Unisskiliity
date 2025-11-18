
import React, { useState } from 'react';
import { Client } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { getRiskScore } from '../../services/geminiService';

interface AddClientModalProps {
  onClose: () => void;
  onAddClient: (client: Client) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onAddClient }) => {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cnic || !phone || !address) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      const clientInfo = { name, cnic, phone, address };
      const riskScore = await getRiskScore(clientInfo);
      
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        ...clientInfo,
        riskScore,
        joinDate: new Date().toISOString().split('T')[0],
      };
      
      onAddClient(newClient);
    } catch (err) {
      setError('Failed to create client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        <Input id="cnic" label="CNIC" type="text" value={cnic} onChange={e => setCnic(e.target.value)} required />
        <Input id="phone" label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        <Input id="address" label="Address" type="text" value={address} onChange={e => setAddress(e.target.value)} required />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-end items-center pt-4 space-x-3">
            {isLoading && <Spinner size="sm" />}
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing Risk...' : 'Save Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;
