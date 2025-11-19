
import React, { useState, useMemo, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { Client, Loan, View, InstallmentStatus, User } from './types';
import { getInitialData } from './utils/initialData';
import Header from './components/ui/Header';
import ClientList from './components/ClientList';
import Login from './components/Login';
import { removeCache } from './utils/cache';
import PageLoader from './components/ui/PageLoader';

// --- Lazy Loaded Components ---
const Dashboard = lazy(() => import('./components/Dashboard'));
const ClientDetails = lazy(() => import('./components/ClientDetails'));
const AddClientModal = lazy(() => import('./components/modals/AddClientModal'));
const AddLoanModal = lazy(() => import('./components/modals/AddLoanModal'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));
const Architecture = lazy(() => import('./components/Architecture'));


const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  
  // 1. Authentication State with RBAC
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('mlms-user');
    return storedUser ? JSON.parse(storedUser) : null;
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
  const contentRef = useRef<HTMLElement>(null);

  // --- SECURITY HARDENING: Session Timeout ---
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('mlms-user');
    setCurrentUser(null);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  }, []);

  const resetSessionTimer = useCallback(() => {
    if (!currentUser) return;
    
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      alert("Session expired due to inactivity.");
      handleLogout();
    }, SESSION_TIMEOUT);
  }, [currentUser, handleLogout]);

  useEffect(() => {
    if (currentUser) {
      resetSessionTimer();
      window.addEventListener('mousemove', resetSessionTimer);
      window.addEventListener('keydown', resetSessionTimer);
      window.addEventListener('click', resetSessionTimer);
    }
    return () => {
      window.removeEventListener('mousemove', resetSessionTimer);
      window.removeEventListener('keydown', resetSessionTimer);
      window.removeEventListener('click', resetSessionTimer);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [currentUser, resetSessionTimer]);


  // --- MEMOIZED SELECTORS ---
  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const clientLoans = useMemo(() => {
    return loans.filter(l => l.clientId === selectedClientId);
  }, [loans, selectedClientId]);

  // --- EFFECTS ---
  
  // Auto-scroll on mobile when client is selected
  useEffect(() => {
      if (selectedClientId && window.innerWidth < 1024 && contentRef.current) {
          contentRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [selectedClientId]);


  // --- HANDLERS ---

  const handleLogin = (user: User) => {
    sessionStorage.setItem('mlms-user', JSON.stringify(user));
    setCurrentUser(user);
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
  
  const handleEditLoan = (updatedLoan: Loan) => {
    setLoans(prevLoans => prevLoans.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan));
    removeCache(`prediction-${updatedLoan.id}`);
  };

  const handleUpdatePayment = (loanId: string, installmentId: string, newStatus: InstallmentStatus, paidAmount?: number) => {
    setLoans(prevLoans => prevLoans.map(loan => {
      if (loan.id === loanId) {
        const newSchedule = loan.schedule.map(inst => {
          if (inst.id === installmentId) {
            const updatedInst = { ...inst, status: newStatus, paymentDate: new Date().toISOString().split('T')[0] };
            if (newStatus === 'Paid') {
              updatedInst.paidAmount = inst.amount;
            } else if (newStatus === 'Partially Paid') {
              updatedInst.paidAmount = paidAmount;
            } else {
              delete updatedInst.paidAmount;
              delete updatedInst.paymentDate;
            }
            return updatedInst;
          }
          return inst;
        });
        
        // Check if all installments are paid to mark loan as Completed
        const allPaid = newSchedule.every(inst => inst.status === 'Paid');
        const newLoanStatus = allPaid ? 'Completed' : loan.status === 'Completed' ? 'Active' : loan.status;

        return {
          ...loan,
          schedule: newSchedule,
          status: newLoanStatus
        };
      }
      return loan;
    }));
    // Invalidate the cache for this loan's prediction since its data has changed
    removeCache(`prediction-${loanId}`);
  };

  const handleUpdateLoanStatus = (loanId: string, newStatus: 'Defaulted' | 'Completed') => {
      setLoans(prevLoans => prevLoans.map(loan => {
          if (loan.id === loanId) {
              return { ...loan, status: newStatus };
          }
          return loan;
      }))
  }

  const handleRunDailyBatch = () => {
    const today = new Date().toISOString().split('T')[0];
    let processedCount = 0;
    let hasChanges = false;

    // Calculate changes first
    const updatedLoans = loans.map(loan => {
        if (loan.status !== 'Active') return loan;

        let loanModified = false;
        const newSchedule = loan.schedule.map(inst => {
            if (inst.status === 'Pending' && inst.dueDate < today) {
                processedCount++;
                loanModified = true;
                return { ...inst, status: 'Overdue' as InstallmentStatus };
            }
            return inst;
        });

        if (loanModified) {
            hasChanges = true;
            return { ...loan, schedule: newSchedule };
        }
        return loan;
    });

    if (hasChanges) {
        setLoans(updatedLoans);
        alert(`✅ Automation Complete\n\nProcessed entire portfolio.\nMarked ${processedCount} missed payments as 'Overdue'.`);
    } else {
        alert("✅ Automation Complete\n\nNo overdue payments found today.");
    }
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    if (view === View.DASHBOARD || view === View.ARCHITECTURE) {
        setSelectedClientId(null);
    }
  };
  
  // --- RENDER LOGIC ---

  const renderContent = () => {
    switch (currentView) {
      case View.CLIENT_DETAILS:
        return selectedClient && (
          <ClientDetails 
            key={selectedClientId} // Add key to force re-mount on client change
            client={selectedClient} 
            loans={clientLoans}
            onAddLoan={() => setAddLoanModalOpen(true)}
            onUpdatePayment={handleUpdatePayment}
            onUpdateLoanStatus={handleUpdateLoanStatus}
            onEditLoan={handleEditLoan}
          />
        );
      case View.ARCHITECTURE:
        return <Architecture />;
      case View.DASHBOARD:
      default:
        return (
          <Dashboard 
            clients={clients} 
            loans={loans} 
            onRunDailyBatch={handleRunDailyBatch} 
            userRole={currentUser?.role}
          />
        );
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <Header 
        user={currentUser}
        onLogout={handleLogout} 
        currentView={currentView} 
        onNavigate={handleNavigate}
      />
      <main className="main-container">
        {currentView === View.ARCHITECTURE ? (
             <div className="animate-slide-up">
                 <Suspense fallback={<PageLoader />}>
                    {renderContent()}
                 </Suspense>
             </div>
        ) : (
            <div className="main-grid">
            <aside className="sidebar-area">
                <ClientList 
                clients={clients} 
                onSelectClient={handleSelectClient}
                onAddClient={() => setAddClientModalOpen(true)}
                selectedClientId={selectedClientId}
                onShowDashboard={() => handleNavigate(View.DASHBOARD)}
                />
            </aside>
            <section className="animate-slide-up" ref={contentRef}>
                <Suspense fallback={<PageLoader />}>
                    {renderContent()}
                </Suspense>
            </section>
            </div>
        )}
      </main>
      
      <Suspense fallback={null}>
         <ChatWidget />
      </Suspense>

      <Suspense fallback={null}>
        {isAddClientModalOpen && (
          <AddClientModal 
            onClose={() => setAddClientModalOpen(false)}
            onAddClient={handleAddClient}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isAddLoanModalOpen && selectedClient && (
          <AddLoanModal
            client={selectedClient}
            onClose={() => setAddLoanModalOpen(false)}
            onAddLoan={handleAddLoan}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;
