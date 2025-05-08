import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
// Mock useAuth
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));
// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => (Object.assign(Object.assign({}, jest.requireActual('react-router-dom')), { useNavigate: () => mockNavigate })));
describe('Navbar', () => {
    const mockLogout = jest.fn();
    beforeEach(() => {
        useAuth.mockReturnValue({
            email: 'test@example.com',
            logout: mockLogout,
        });
        jest.spyOn(window, 'location', 'get').mockReturnValue(Object.assign(Object.assign({}, window.location), { reload: jest.fn() }));
        localStorage.setItem('searchQuery', 'hello');
    });
    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });
    it('renders user email and logout button', () => {
        render(React.createElement(Navbar, null), { wrapper: MemoryRouter });
        expect(screen.getByText(/Welcome, test@example.com/)).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    it('clears searchQuery and navigates home on logo click', () => {
        render(React.createElement(Navbar, null), { wrapper: MemoryRouter });
        const logo = screen.getByAltText('Lyrix Logo');
        fireEvent.click(logo);
        expect(localStorage.getItem('searchQuery')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(window.location.reload).toHaveBeenCalled();
    });
});
