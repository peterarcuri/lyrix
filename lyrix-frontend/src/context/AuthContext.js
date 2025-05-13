var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const login = (authToken, email) => __awaiter(void 0, void 0, void 0, function* () {
        setToken(authToken);
        setEmail(email);
        localStorage.setItem('token', authToken);
        localStorage.setItem('email', email);
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        try {
            const res = yield fetch(`${API_BASE}/api/v1/playlists`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (res.ok) {
                const playlists = yield res.json();
                localStorage.setItem('lyrix_playlists', JSON.stringify(playlists));
            }
            else {
                console.warn('Failed to fetch playlists on login');
            }
        }
        catch (err) {
            console.error('Error fetching playlists on login:', err);
        }
    });
    const logout = () => __awaiter(void 0, void 0, void 0, function* () {
        const playlists = localStorage.getItem('lyrix_playlists');
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        if (token && playlists) {
            try {
                yield fetch(`${API_BASE}/api/v1/playlists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: playlists,
                });
            }
            catch (err) {
                console.error('Error saving playlists before logout:', err);
            }
        }
        setToken(null);
        setEmail(null);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('lyrix_playlists');
    });
    return (React.createElement(AuthContext.Provider, { value: { token, email, login, logout } }, children));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
