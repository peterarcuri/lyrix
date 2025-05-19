import React, { createContext, useContext, useState, useEffect } from 'react';

interface Playlist {
  name: string;
  songs: any[];
}

interface AuthContextProps {
  token: string | null;
  email: string | null;
  playlists: Playlist[];
  login: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  setPlaylists: (playlists: Playlist[]) => void;
  addPlaylist: (playlist: Playlist) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
  const [playlists, setPlaylistsState] = useState<Playlist[]>(() => {
    const storedPlaylists = localStorage.getItem('lyrix_playlists');
    return storedPlaylists ? JSON.parse(storedPlaylists) : [];
  });

  useEffect(() => {
    console.log('Playlists state updated:', playlists);
  }, [playlists]);

  const setPlaylists = (newPlaylists: Playlist[]) => {
    console.log('Setting new playlists:', newPlaylists);
    setPlaylistsState(newPlaylists);
    localStorage.setItem('lyrix_playlists', JSON.stringify(newPlaylists));
  };

  const addPlaylist = (playlist: Playlist) => {
    setPlaylists([...playlists, playlist]);
  };

  const login = async (authToken: string, userEmail: string) => {
    setToken(authToken);
    setEmail(userEmail);
    localStorage.setItem('token', authToken);
    localStorage.setItem('email', userEmail);
  
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
        if (Array.isArray(fetchedPlaylists)) {
          setPlaylists(fetchedPlaylists);
        } else {
          setPlaylists([fetchedPlaylists]);
        }
        console.log('✅ Playlists loaded on login:', fetchedPlaylists);
      } else {
        console.warn('Failed to fetch playlists on login');
        setPlaylistsState([]);
        localStorage.removeItem('lyrix_playlists');
      }
    } catch (err) {
      console.error('Error fetching playlists on login:', err);
      setPlaylistsState([]);
      localStorage.removeItem('lyrix_playlists');
    }
  };
  
  const logout = async () => {
    console.log('🔒 logout() called');
    console.log('📦 Playlists from state:', playlists);
  
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
    if (token && playlists.length > 0) {
      try {
        console.log('🌐 Logout using API_BASE:', API_BASE);
        console.log('Saving playlists:', playlists);
        
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
      } catch (err) {
        console.error('Error saving playlists before logout:', err);
      }
    } else {
      console.log('No playlists to save before logout');
    }
  
    setToken(null);
    setEmail(null);
    setPlaylistsState([]);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('lyrix_playlists');
  
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ token, email, playlists, login, logout, setPlaylists, addPlaylist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};