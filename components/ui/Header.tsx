
import React from 'react';
import Button from './Button';
import { View } from '../../types';

interface HeaderProps {
  onLogout: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, currentView, onNavigate }) => {
  return (
    <header className="header">
      <div className="header-content">
         <div className="header-logo" onClick={() => onNavigate(View.DASHBOARD)} style={{cursor: 'pointer'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="header-title">
              AI Microfinance
            </h1>
         </div>
         
         <nav style={{ display: 'flex', gap: '1.5rem' }}>
             <button 
                onClick={() => onNavigate(View.DASHBOARD)}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontWeight: currentView === View.DASHBOARD || currentView === View.CLIENT_DETAILS ? 700 : 500,
                    color: currentView === View.DASHBOARD || currentView === View.CLIENT_DETAILS ? 'var(--color-teal-700)' : 'var(--color-gray-500)',
                    cursor: 'pointer'
                }}
             >
                Dashboard
             </button>
             <button 
                onClick={() => onNavigate(View.ARCHITECTURE)}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontWeight: currentView === View.ARCHITECTURE ? 700 : 500,
                    color: currentView === View.ARCHITECTURE ? 'var(--color-teal-700)' : 'var(--color-gray-500)',
                    cursor: 'pointer'
                }}
             >
                System Architecture
             </button>
         </nav>

         <Button onClick={onLogout} variant="secondary" size="sm">
            Logout
         </Button>
      </div>
    </header>
  );
};

export default Header;
