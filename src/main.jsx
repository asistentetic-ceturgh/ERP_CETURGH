import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './Login';
import './index.css';

const Root = () => {
  // Usuario desde localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return user ? (
    <App user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);