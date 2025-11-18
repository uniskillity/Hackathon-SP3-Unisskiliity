import React from 'react';
import Button from './Button';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
         <div className="header-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="header-title">
              AI Microfinance Loan Manager
            </h1>
         </div>
         <Button onClick={onLogout} variant="secondary" size="sm">
            Logout
         </Button>
      </div>
    </header>
  );
};

export default Header;
