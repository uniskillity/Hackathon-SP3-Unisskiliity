import React from 'react';
import Button from './Button';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
         <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">
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