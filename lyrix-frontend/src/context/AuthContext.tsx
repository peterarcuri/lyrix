import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextProps {
  token: string | null;
  email: string | null;
  playlists: any[] | null; // Add this line
  login: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  setPlaylists: (playlists: any[]) => void; // Add this line
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
  const [playlists, setPlaylistsState] = useState<any[] | null>(() => {
    const storedPlaylists = localStorage.getItem('lyrix_playlists');
    return storedPlaylists ? JSON.parse(storedPlaylists) : null;
  });

  const setPlaylists = (newPlaylists: any[]) => {
    console.log('Setting new playlists:', newPlaylists);
    setPlaylistsState(newPlaylists);
    localStorage.setItem('lyrix_playlists', JSON.stringify(newPlaylists));
  };

  useEffect(() => {
    console.log('AuthContext - Current playlists:', playlists);
  }, [playlists]);

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
        const fetchedPlaylists = await res.json();
        console.log('Fetched playlists:', fetchedPlaylists);
        setPlaylists(fetchedPlaylists);
      } else {
        console.warn('Failed to fetch playlists on login. Status:', res.status);
        setPlaylistsState(null);
        localStorage.removeItem('lyrix_playlists');
      }
    } catch (err) {
      console.error('Error fetching playlists on login:', err);
      setPlaylistsState(null);
      localStorage.removeItem('lyrix_playlists');
    }
  };

  const logout = async () => {
    console.log('Logout called. Current playlists:', playlists);
    
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    if (token && playlists && playlists.length > 0) {
      try {
        console.log('Saving playlists to API:', `${API_BASE}/api/v1/playlists`);
        const res = await fetch(`${API_BASE}/api/v1/playlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ playlists }),
        });
        
        console.log('Playlist save response:', res.status);
        if (!res.ok) {
          console.warn('Failed to save playlists on logout. Status:', res.status);
        }
      } catch (err) {
        console.error('Error saving playlists before logout:', err);
      }
    } else {
      console.log('No playlists to save before logout');
    }
    
    setToken(null);
    setEmail(null);
    setPlaylistsState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('lyrix_playlists');
    
    window.location.href = '/';
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