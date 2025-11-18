import React, { useState, useMemo, useEffect } from 'react';
import { Client, Loan, View } from './types';
import { getInitialData } from './utils/initialData';
import Header from './components/ui/Header';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails';
import AddClientModal from './components/modals/AddClientModal';
import AddLoanModal from './components/modals/AddLoanModal';
import Login from './components/Login';
import { removeCache } from './utils/cache';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check session storage for auth flag
    return sessionStorage.getItem('mlms-auth') === 'true';
  });

  // 2. Data Persistence State (Simulating Database)
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('mlms-clients');
    if (savedClients) {
      return JSON.parse(savedClients);
    }
    return getInitialData().clients;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const savedLoans = localStorage.getItem('mlms-loans');
    if (savedLoans) {
      return JSON.parse(savedLoans);
    }
    return getInitialData().loans;
  });

  // Save clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mlms-clients', JSON.stringify(clients));
  }, [clients]);

  // Save loans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mlms-loans', JSON.stringify(loans));
  }, [loans]);

  // 3. UI State
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAddClientModalOpen, setAddClientModalOpen] = useState(false);
  const [isAddLoanModalOpen, setAddLoanModalOpen] = useState(false);

  // --- MEMOIZED SELECTORS ---
  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const clientLoans = useMemo(() => {
    return loans.filter(l => l.clientId === selectedClientId);
  }, [loans, selectedClientId]);

  // --- HANDLERS ---

  // Authentication Handlers
  const handleLogin = () => {
    sessionStorage.setItem('mlms-auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mlms-auth');
    setIsAuthenticated(false);
  };

  // Data Handlers
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView(View.CLIENT_DETAILS);
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prevClients => [...prevClients, newClient]);
    setAddClientModalOpen(false);
  };
  
  const handleAddLoan = (newLoan: Loan) => {
    setLoans(prevLoans => [...prevLoans, newLoan]);
    setAddLoanModalOpen(false);
  };

  const handleUpdatePayment = (loanId: string, installmentId: string, isPaid: boolean) => {
    setLoans(prevLoans => prevLoans.map(loan => {
      if (loan.id === loanId) {
        return {
          ...loan,
          schedule: loan.schedule.map(inst => {
            if (inst.id === installmentId) {
              return { ...inst, status: isPaid ? 'Paid' : 'Pending' as 'Paid' | 'Pending' | 'Overdue' };
            }
            return inst;
          }),
        };
      }
      return loan;
    }));
    // Invalidate the cache for this loan's prediction since its data has changed
    removeCache(`prediction-${loanId}`);
  };
  
  // --- RENDER LOGIC ---

  const renderContent = () => {
    switch (currentView) {
      case View.CLIENT_DETAILS:
        return selectedClient && (
          <ClientDetails 
            client={selectedClient} 
            loans={clientLoans}
            onAddLoan={() => setAddLoanModalOpen(true)}
            onUpdatePayment={handleUpdatePayment}
          />
        );
      case View.DASHBOARD:
      default:
        return <Dashboard clients={clients} loans={loans} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header onLogout={handleLogout} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ClientList 
              clients={clients} 
              onSelectClient={handleSelectClient}
              onAddClient={() => setAddClientModalOpen(true)}
              selectedClientId={selectedClientId}
              onShowDashboard={() => {
                setSelectedClientId(null);
                setCurrentView(View.DASHBOARD);
              }}
            />
          </div>
          <div className="lg:col-span-2">
            {renderContent()}
          </div>
        </div>
      </main>

      {isAddClientModalOpen && (
        <AddClientModal 
          onClose={() => setAddClientModalOpen(false)}
          onAddClient={handleAddClient}
        />
      )}

      {isAddLoanModalOpen && selectedClient && (
        <AddLoanModal
          client={selectedClient}
          onClose={() => setAddLoanModalOpen(false)}
          onAddLoan={handleAddLoan}
        />
      )}
    </div>
  );
};

export default App;