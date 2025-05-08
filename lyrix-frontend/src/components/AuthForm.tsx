import React, { useState } from 'react';
import { login, signup } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res =
        type === 'login'
          ? await login({ email, password })
          : await signup({ email, password });
      setAuth(res.data.token, res.data.email);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Auth failed');
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{type === 'login' ? 'Login' : 'Signup'}</h2>
        <input
          type="email"
          className="search-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="search-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="search-button">
          {type === 'login' ? 'Login' : 'Signup'}
        </button>
      </form>
    </div>
  );
};


