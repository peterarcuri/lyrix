var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Mock dependencies
jest.mock('../services/api');
jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => (Object.assign(Object.assign({}, jest.requireActual('react-router-dom')), { useNavigate: jest.fn() })));
describe('AuthForm', () => {
    const mockSetAuth = jest.fn();
    const mockNavigate = jest.fn();
    beforeEach(() => {
        useAuth.mockReturnValue({ login: mockSetAuth });
        useNavigate.mockReturnValue(mockNavigate);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('submits login form and sets auth', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock login response
        login.mockResolvedValue({
            data: { token: 'fake-token', email: 'test@example.com' },
        });
        render(React.createElement(AuthForm, { type: "login" }));
        // Fill in the form
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        yield waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mockSetAuth).toHaveBeenCalledWith('fake-token', 'test@example.com');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    }));
});
