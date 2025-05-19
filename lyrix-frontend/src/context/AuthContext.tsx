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
  removePlaylist: (playlistName: string) => void;
  updatePlaylist: (updatedPlaylist: Playlist) => void;
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
    localStorage.setItem('lyrix_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const setPlaylists = (newPlaylists: Playlist[]) => {
    console.log('Setting new playlists:', newPlaylists);
    setPlaylistsState(newPlaylists);
  };

  const addPlaylist = (playlist: Playlist) => {
    console.log('Adding new playlist:', playlist);
    setPlaylistsState(prevPlaylists => [...prevPlaylists, playlist]);
  };

  const removePlaylist = (playlistName: string) => {
    console.log('Removing playlist:', playlistName);
    setPlaylistsState(prevPlaylists => prevPlaylists.filter(p => p.name !== playlistName));
  };

  const updatePlaylist = (updatedPlaylist: Playlist) => {
    console.log('Updating playlist:', updatedPlaylist);
    setPlaylistsState(prevPlaylists => 
      prevPlaylists.map(p => p.name === updatedPlaylist.name ? updatedPlaylist : p)
    );
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
        console.log('Fetched playlists:', fetchedPlaylists);
  
        // Get existing playlists from local storage
        const existingPlaylists = JSON.parse(localStorage.getItem('lyrix_playlists') || '[]');
  
        let newPlaylists: Playlist[];
        if (Array.isArray(fetchedPlaylists)) {
          newPlaylists = fetchedPlaylists;
        } else if (fetchedPlaylists && typeof fetchedPlaylists === 'object') {
          newPlaylists = [fetchedPlaylists];
        } else {
          console.warn('Unexpected playlist data format:', fetchedPlaylists);
          newPlaylists = [];
        }
  
        // Merge fetched playlists with existing playlists
        const mergedPlaylists = [...existingPlaylists, ...newPlaylists];
  
        // Remove duplicates based on playlist name
        const uniquePlaylists = mergedPlaylists.reduce((acc: Playlist[], current) => {
          const x = acc.find(item => item.name === current.name);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
  
        setPlaylists(uniquePlaylists);
        console.log('✅ Playlists loaded on login:', uniquePlaylists);
      } else {
        console.warn('Failed to fetch playlists on login');
        setPlaylists([]);
      }
    } catch (err) {
      console.error('Error fetching playlists on login:', err);
      setPlaylists([]);
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
    <AuthContext.Provider value={{ 
      token, 
      email, 
      playlists, 
      login, 
      logout, 
      setPlaylists, 
      addPlaylist,
      removePlaylist,
      updatePlaylist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};