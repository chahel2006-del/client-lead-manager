import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('auth') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem('auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
  };

  return (
    <ErrorBoundary>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ErrorBoundary>
  );
}

export default App;
