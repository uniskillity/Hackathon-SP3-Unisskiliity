
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

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">Clients</h3>
        <input
          type="text"
          placeholder="Search by name or CNIC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
        />
      </div>

       <nav className="flex-1 min-h-0 overflow-y-auto">
        <ul>
            <li 
                className={`cursor-pointer p-4 border-b border-gray-200 ${isDashboardSelected ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
                onClick={onShowDashboard}
            >
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-4 ${isDashboardSelected ? 'bg-teal-500' : 'bg-transparent'}`}></div>
                    <p className="font-semibold text-gray-800">Dashboard</p>
                </div>
            </li>
          {filteredClients.map(client => (
            <li
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={`cursor-pointer p-4 border-b border-gray-200 ${selectedClientId === client.id ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                   <div className={`w-3 h-3 rounded-full mr-4 ${selectedClientId === client.id ? 'bg-teal-500' : 'bg-transparent'}`}></div>
                   <div>
                        <p className="font-semibold text-gray-800">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.cnic}</p>
                   </div>
                </div>
                <Badge type={client.riskScore} />
              </div>
            </li>
          ))}
           {filteredClients.length === 0 && (
                <li className="p-4 text-center text-gray-500">No clients found.</li>
            )}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button onClick={onAddClient} className="w-full">
          + Add New Client
        </Button>
      </div>
    </Card>
  );
};

export default ClientList;
