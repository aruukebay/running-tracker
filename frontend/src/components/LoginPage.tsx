// frontend/src/components/LoginPage.tsx

import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://running-tracker-x6r2.onrender.com';
const API_URL = `${API_BASE_URL}/api/login`;
const TOKEN_KEY = 'authToken'; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(API_URL, { email, password });

      if (response.data.success && response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        navigate('/'); 
      } else {
        setError('Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Invalid email or password. Use runner@example.com / password123');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} className="login-form">
        
        <p className="hint">Use runner@example.com / password123</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;