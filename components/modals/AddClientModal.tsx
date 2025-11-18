import React, { useState, useRef } from 'react';
import { Client, ClientDocument } from '../../types';
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
  const [income, setIncome] = useState('');
  const [occupation, setOccupation] = useState('');
  const [householdSize, setHouseholdSize] = useState('');
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc: ClientDocument = {
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setDocuments(prev => [...prev, newDoc]);
       // Reset file input
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cnic || !phone || !address) {
      setError('Required fields must be filled.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      const clientInfo = { 
          name, 
          cnic, 
          phone, 
          address,
          income: parseInt(income) || undefined,
          occupation: occupation || undefined,
          householdSize: parseInt(householdSize) || undefined,
      };
      const riskScore = await getRiskScore(clientInfo);
      
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        ...clientInfo,
        riskScore,
        joinDate: new Date().toISOString().split('T')[0],
        documents,
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
      <form onSubmit={handleSubmit} className="modal-form space-y-4">
        <h4 style={{fontWeight: 700, color: 'var(--color-gray-600)', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '0.5rem'}}>Personal Information</h4>
        <Input id="name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        <Input id="cnic" label="CNIC" type="text" value={cnic} onChange={e => setCnic(e.target.value)} required />
        <Input id="phone" label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        <Input id="address" label="Address" type="text" value={address} onChange={e => setAddress(e.target.value)} required />
        
        <h4 style={{fontWeight: 700, color: 'var(--color-gray-600)', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '0.5rem', paddingTop: '1rem'}}>Optional Details</h4>
        <Input id="income" label="Monthly Income (PKR)" type="number" value={income} onChange={e => setIncome(e.target.value)} />
        <Input id="occupation" label="Occupation" type="text" value={occupation} onChange={e => setOccupation(e.target.value)} />
        <Input id="householdSize" label="Household Size" type="number" value={householdSize} onChange={e => setHouseholdSize(e.target.value)} />
        
        <div>
           <label className="input-label">Documents</label>
           <div className="file-upload-box">
                <div className="file-upload-content">
                    <svg style={{margin: '0 auto', height: '3rem', width: '3rem', color: 'var(--color-gray-400)'}} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div style={{fontSize: '0.875rem', color: 'var(--color-gray-600)'}}>
                        <label htmlFor="file-upload" className="file-upload-label">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef}/>
                        </label>
                        <span style={{paddingLeft: '0.25rem'}}>(CNIC, Scorecard, etc.)</span>
                    </div>
                </div>
           </div>
           {documents.length > 0 && (
                <ul style={{marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-gray-500)', listStyle: 'disc', paddingLeft: '1.25rem'}}>
                    {documents.map(doc => <li key={doc.fileName}>{doc.fileName}</li>)}
                </ul>
           )}
        </div>

        {error && <p className="text-danger">{error}</p>}
        
        <div className="modal-footer">
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
