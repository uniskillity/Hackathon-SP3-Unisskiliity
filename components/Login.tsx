
import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock User Directory
    if (username === 'admin' && password === 'admin123') {
      onLogin({
        username: 'admin',
        name: 'System Administrator',
        role: 'Admin'
      });
    } else if (username === 'officer' && password === 'officer123') {
      onLogin({
        username: 'officer',
        name: 'Ali Raza',
        role: 'Officer'
      });
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1>AI Microfinance Loan Manager</h1>
            <p>Secure Loan Management System</p>
        </div>
        <Card>
          <div className="card-body">
            <form onSubmit={handleLogin} className="space-y-6">
                <Input 
                id="username" 
                label="Username" 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                autoComplete="username"
                placeholder="e.g. admin or officer"
                />
                <Input 
                id="password" 
                label="Password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                autoComplete="current-password"
                />
                {error && (
                    <div className="alert alert-danger" style={{padding: '0.5rem', fontSize: '0.85rem'}}>
                        {error}
                    </div>
                )}
                
                <div style={{fontSize: '0.8rem', color: 'var(--color-slate-500)', textAlign: 'center', background: 'var(--color-slate-50)', padding: '0.5rem', borderRadius: 'var(--radius-md)'}}>
                    <p><strong>Demo Credentials:</strong></p>
                    <p>Admin: <code>admin / admin123</code></p>
                    <p>Officer: <code>officer / officer123</code></p>
                </div>

                <Button type="submit" className="btn-full">
                Sign In
                </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;