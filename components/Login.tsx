import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call. Here, we use dummy credentials.
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid username or password. (Hint: admin / password)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">AI Microfinance Loan Manager</h1>
            <p className="text-gray-500">Please sign in to continue</p>
        </div>
        <Card>
          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              id="username" 
              label="Username" 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              autoComplete="username"
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
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
