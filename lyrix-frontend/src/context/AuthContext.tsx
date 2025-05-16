import React, { createContext, useContext, useState } from 'react';
import { savePlaylists } from '../utils/playlistStorage';
import { usePlaylist } from '../../src/context/PlaylistContext';

interface AuthContextProps {
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));

  const login = async (authToken: string, email: string) => {
    setToken(authToken);
    setEmail(email);
    localStorage.setItem('token', authToken);
    localStorage.setItem('email', email);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    try {
      console.log('🔍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

      const res = await fetch(`${API_BASE}/api/v1/playlists`, {
        method: 'GET', 
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const playlists = await res.json();
        localStorage.setItem('lyrix_playlists', JSON.stringify(playlists));
        savePlaylists(playlists);
      } else {
        console.warn('Failed to fetch playlists on login');
      }
    } catch (err) {
      console.error('Error fetching playlists on login:', err);
    }
  };

  const logout = async () => {
    console.log('🔒 logout() called');
  
    const { playlists } = usePlaylist();
    console.log('📦 Playlists from localStorage:', playlists);
  
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
    if (token && playlists) {
      try {
        if (playlists.length > 0) {
          console.log('🌐 Logout using API_BASE:', API_BASE);
  
          const res = await fetch(`${API_BASE}/api/v1/playlists`, {
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
        } else {
          console.log('No playlists to save before logout');
        }
      } catch (err) {
        console.error('Error saving playlists before logout:', err);
      }
    }
  
    setToken(null);
    setEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('lyrix_playlists');
  
    window.location.href = '/';
  };
  
  
  

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};