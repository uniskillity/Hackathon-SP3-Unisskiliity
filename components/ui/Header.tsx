
import React from 'react';
import Button from './Button';
import { View, User } from '../../types';

interface HeaderProps {
  user?: User;
  onLogout: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, onNavigate }) => {
  return (
    <header className="header">
      <div className="header-content">
         <div className="header-logo" onClick={() => onNavigate(View.DASHBOARD)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9.375 12.75a.375.375 0 0 1 .375-.375h.75a3.375 3.375 0 1 1 0 6.75h-.75a.375.375 0 0 1-.375-.375v-6Zm1.5 5.625h.375a2.25 2.25 0 1 0 0-4.5h-.375v4.5Zm2.25-5.625a.375.375 0 0 1 .375-.375h1.875a.375.375 0 0 1 0 .75h-1.875v1.5h1.875a.375.375 0 0 1 0 .75h-1.875v1.5h1.875a.375.375 0 0 1 0 .75h-2.25a.375.375 0 0 1-.375-.375v-4.5Z" clipRule="evenodd" />
            </svg>
            <span className="header-title">
              AI Microfinance
            </span>
         </div>
         
         <div className="header-actions">
             <nav className="header-nav">
                 <button 
                    onClick={() => onNavigate(View.DASHBOARD)}
                    className={`nav-link ${currentView === View.DASHBOARD || currentView === View.CLIENT_DETAILS ? 'active' : ''}`}
                 >
                    Dashboard
                 </button>
                 <button 
                    onClick={() => onNavigate(View.ARCHITECTURE)}
                    className={`nav-link ${currentView === View.ARCHITECTURE ? 'active' : ''}`}
                 >
                    Architecture
                 </button>
             </nav>

             {user && (
                 <div className="hidden-mobile" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem', paddingRight: '0.5rem', borderRight: '1px solid var(--color-slate-200)'}}>
                     <div style={{textAlign: 'right'}}>
                         <div style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-800)'}}>{user.name}</div>
                         <div style={{fontSize: '0.7rem', color: 'var(--color-primary-600)', textTransform: 'uppercase', fontWeight: 700}}>{user.role}</div>
                     </div>
                     <div style={{width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>
                         {user.name.charAt(0)}
                     </div>
                 </div>
             )}

             <Button onClick={onLogout} variant="secondary" size="sm" aria-label="Sign Out">
                Sign Out
             </Button>
         </div>
      </div>
    </header>
  );
};

export default Header;