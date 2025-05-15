var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [playlists, setPlaylistsState] = useState(() => {
        const storedPlaylists = localStorage.getItem('lyrix_playlists');
        return storedPlaylists ? JSON.parse(storedPlaylists) : null;
    });
    // Helper function to update playlists in both state and localStorage
    const setPlaylists = (newPlaylists) => {
        setPlaylistsState(newPlaylists);
        localStorage.setItem('lyrix_playlists', JSON.stringify(newPlaylists));
    };
    // Load playlists from localStorage on initial mount
    useEffect(() => {
        if (token && !playlists) {
            const storedPlaylists = localStorage.getItem('lyrix_playlists');
            if (storedPlaylists) {
                setPlaylistsState(JSON.parse(storedPlaylists));
            }
        }
    }, [token, playlists]);
    const login = (authToken, email) => __awaiter(void 0, void 0, void 0, function* () {
        setToken(authToken);
        setEmail(email);
        localStorage.setItem('token', authToken);
        localStorage.setItem('email', email);
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        try {
            console.log('🔍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
            const res = yield fetch(`${API_BASE}/api/v1/playlists`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (res.ok) {
                const fetchedPlaylists = yield res.json();
                // Update both state and localStorage
                setPlaylists(fetchedPlaylists);
                console.log('✅ Playlists loaded on login:', fetchedPlaylists);
            }
            else {
                console.warn('Failed to fetch playlists on login');
                // Clear playlists if fetch fails
                setPlaylistsState(null);
                localStorage.removeItem('lyrix_playlists');
            }
        }
        catch (err) {
            console.error('Error fetching playlists on login:', err);
            // Clear playlists if fetch fails
            setPlaylistsState(null);
            localStorage.removeItem('lyrix_playlists');
        }
    });
    const logout = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('🔒 logout() called');
        console.log('📦 Playlists from state:', playlists);
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        if (token && playlists && playlists.length > 0) {
            try {
                console.log('🌐 Logout using API_BASE:', API_BASE);
                // ❗️Important: await this and don't clear localStorage too early
                const res = yield fetch(`${API_BASE}/api/v1/playlists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(playlists),
                });
                console.log('✅ Playlist save response:', res.status);
                if (!res.ok) {
                    console.warn('❌ Failed to save playlists on logout');
                }
            }
            catch (err) {
                console.error('Error saving playlists before logout:', err);
            }
        }
        else {
            console.log('No playlists to save before logout');
        }
        // ✅ Only clear & navigate AFTER async POST completes
        setToken(null);
        setEmail(null);
        setPlaylistsState(null);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('lyrix_playlists');
        // Optional: use router navigation or window.location to redirect after logout
        window.location.href = '/';
    });
    return (React.createElement(AuthContext.Provider, { value: { token, email, playlists, login, logout, setPlaylists } }, children));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
