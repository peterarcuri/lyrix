import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children, }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const login = (token, email) => {
        setToken(token);
        setEmail(email);
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
    };
    const logout = () => {
        setToken(null);
        setEmail(null);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
    };
    return (_jsx(AuthContext.Provider, { value: { token, email, login, logout }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
