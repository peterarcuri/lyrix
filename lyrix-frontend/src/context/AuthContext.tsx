import React, { createContext, useContext, useState } from 'react';

interface Song {
  _id: string;
  title: string;
  artist: string;
  songLyrics: string;
}

interface Playlist {
  name: string;
  songs: Song[];
}

interface AuthContextType {
  token: string | null;
  email: string | null;
  playlists: Playlist[] | null;
  login: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  setPlaylists: (playlists: Playlist[] | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
  const [playlists, setPlaylistsState] = useState<Playlist[] | null>(() => {
    const stored = localStorage.getItem('lyrix_playlists');
    return stored ? JSON.parse(stored) : null;
  });

  // Helper function to update playlists in both state and localStorage
  const setPlaylists = (newPlaylists: Playlist[] | null) => {
    setPlaylistsState(newPlaylists);
    if (newPlaylists) {
      localStorage.setItem('lyrix_playlists', JSON.stringify(newPlaylists));
    } else {
      localStorage.removeItem('lyrix_playlists');
    }
  };

  const login = async (authToken: string, email: string) => {
    setToken(authToken);
    setEmail(email);
    localStorage.setItem('token', authToken);
    localStorage.setItem('email', email);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${API_BASE}/api/v1/playlists`, {
        method: 'GET', 
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const fetchedPlaylists = await res.json();
        setPlaylists(fetchedPlaylists);
        console.log(' Playlists loaded on login:', fetchedPlaylists);
      } else {
        console.warn('Failed to fetch playlists on login');
        setPlaylists(null);
      }
    } catch (err) {
      console.error('Error fetching playlists on login:', err);
      setPlaylists(null);
    }
  };

  const logout = async () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    
    if (token && playlists && playlists.length > 0) {
      try {
        console.log('Saving playlists before logout:', playlists);
        const res = await fetch(`${API_BASE}/api/v1/playlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(playlists),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Failed to save playlists before logout:', errorData);
          throw new Error('Failed to save playlists');
        }
      } catch (err) {
        console.error('Error saving playlists before logout:', err);
        // Continue with logout even if saving playlists fails
      }
    }

    setToken(null);
    setEmail(null);
    setPlaylists(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('lyrix_playlists');
    localStorage.removeItem('searchQuery');
  };

  return (
    <AuthContext.Provider value={{ token, email, playlists, login, logout, setPlaylists }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};