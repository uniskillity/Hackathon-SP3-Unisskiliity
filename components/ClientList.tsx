
import React, { useState } from 'react';
import { Client } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onAddClient: () => void;
  selectedClientId: string | null;
  onShowDashboard: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddClient, selectedClientId, onShowDashboard }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cnic.includes(searchTerm)
  );
  
  const isDashboardSelected = selectedClientId === null;

  // Mask CNIC (e.g., 12345-*******-3)
  const maskCNIC = (cnic: string) => {
      return cnic.replace(/(\d{5}-)(\d{7})(-\d)/, '$1*******$3');
  };

  return (
    <Card className="client-list-card">
        <div className="card-body">
            <div className="client-list-header">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                    <h3>Clients</h3>
                    <Button onClick={onAddClient} size="sm" style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '1rem', height: '1rem'}}>
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New
                    </Button>
                </div>
                <input
                type="text"
                placeholder="Search by name or CNIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                />
            </div>
            <nav className="client-list-nav">
                <ul>
                    <li
                        key="dashboard-link" 
                        className={`client-list-item ${isDashboardSelected ? 'selected' : ''}`}
                        onClick={onShowDashboard}
                    >
                        <div className="client-list-item-details">
                            <div className={`client-list-item-indicator ${isDashboardSelected ? 'selected' : ''}`}></div>
                            <p className="client-list-item-name">Dashboard</p>
                        </div>
                    </li>
                {filteredClients.map(client => (
                    <li
                    key={client.id}
                    onClick={() => onSelectClient(client.id)}
                    className={`client-list-item ${selectedClientId === client.id ? 'selected' : ''}`}
                    >
                    <div className="client-list-item-content">
                        <div className="client-list-item-details">
                        <div className={`client-list-item-indicator ${selectedClientId === client.id ? 'selected' : ''}`}></div>
                        <div>
                                <p className="client-list-item-name">{client.name}</p>
                                <p className="client-list-item-cnic">{maskCNIC(client.cnic)}</p>
                        </div>
                        </div>
                        <Badge type={client.riskScore} />
                    </div>
                    </li>
                ))}
                {filteredClients.length === 0 && (
                        <li className="client-list-item" style={{textAlign: 'center', color: 'var(--color-gray-500)'}}>No clients found.</li>
                    )}
                </ul>
            </nav>
            <div className="client-list-footer">
                <Button onClick={onAddClient} className="btn-full">
                + Add New Client
                </Button>
            </div>
        </div>
    </Card>
  );
};

export default ClientList;
