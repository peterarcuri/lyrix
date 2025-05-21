import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

interface AuthContextProps {
  token: string | null;
  email: string | null;
  playlists: any[] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setPlaylists: (playlists: any[]) => Promise<void>;
  addPlaylist: (playlist: any) => Promise<void>;
  removePlaylist: (playlistName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
  const [playlists, setPlaylistsState] = useState<any[] | null>(() => {
    const storedPlaylists = localStorage.getItem('lyrix_playlists');
    return storedPlaylists ? JSON.parse(storedPlaylists) : null;
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Helper function to update playlists in both state, localStorage, and server
  const setPlaylists = async (newPlaylists: any[]) => {
    setPlaylistsState(newPlaylists);
    localStorage.setItem('lyrix_playlists', JSON.stringify(newPlaylists));
    
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/v1/playlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPlaylists),
        });
        
        if (!res.ok) {
          console.warn('Failed to save playlists to server');
        }
      } catch (err) {
        console.error('Error saving playlists to server:', err);
      }
    }
  };

  const addPlaylist = async (playlist: any) => {
    const updatedPlaylists = [...(playlists || []), playlist];
    await setPlaylists(updatedPlaylists);
  };

  const removePlaylist = async (playlistName: string) => {
    const updatedPlaylists = (playlists || []).filter(p => p.name !== playlistName);
    await setPlaylists(updatedPlaylists);
  };

  const fetchPlaylists = async () => {
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/v1/playlists`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const fetchedPlaylists = await res.json();
          setPlaylistsState(fetchedPlaylists);
          localStorage.setItem('lyrix_playlists', JSON.stringify(fetchedPlaylists));
        } else {
          console.warn('Failed to fetch playlists from server');
        }
      } catch (err) {
        console.error('Error fetching playlists from server:', err);
      }
    }
  };

  // Load playlists from server on initial mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/api/v1/playlists`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (res.ok) {
            const fetchedPlaylists = await res.json();
            setPlaylistsState(fetchedPlaylists);
            localStorage.setItem('lyrix_playlists', JSON.stringify(fetchedPlaylists));
          } else {
            console.warn('Failed to fetch playlists from server');
          }
        } catch (err) {
          console.error('Error fetching playlists from server:', err);
        }
      }
    };

    fetchPlaylists();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password });
      const { token: authToken, email: userEmail } = response.data;
      setToken(authToken);
      setEmail(userEmail);
      localStorage.setItem('token', authToken);
      localStorage.setItem('email', userEmail);
      // Fetch playlists after successful login
      await fetchPlaylists();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    setEmail(null);
    setPlaylistsState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('lyrix_playlists');
  };

  return (
    <AuthContext.Provider value={{ token, email, playlists, login, logout, setPlaylists, addPlaylist, removePlaylist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};