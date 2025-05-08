import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { AuthForm } from './AuthForm';
import { login, signup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('../services/api');
jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('AuthForm', () => {
  const mockSetAuth = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockSetAuth });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('submits login form and sets auth', async () => {
    // Mock login response
    (login as jest.Mock).mockResolvedValue({
      data: { token: 'fake-token', email: 'test@example.com' },
    });

    render(<AuthForm type="login" />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetAuth).toHaveBeenCalledWith(
        'fake-token',
        'test@example.com'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
