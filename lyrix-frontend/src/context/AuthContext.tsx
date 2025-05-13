import React, { createContext, useContext, useState } from 'react';

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

    try {
      const res = await fetch('/api/v1/playlists', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const playlists = await res.json();
        localStorage.setItem('lyrix_playlists', JSON.stringify(playlists));
      } else {
        console.warn('Failed to fetch playlists on login');
      }
    } catch (err) {
      console.error('Error fetching playlists on login:', err);
    }
  };

  const logout = async () => {
    const playlists = localStorage.getItem('lyrix_playlists');

    if (token && playlists) {
      try {
        await fetch('/api/playlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: playlists, // this is already a JSON string
        });
      } catch (err) {
        console.error('Error saving playlists before logout:', err);
      }
    }

    setToken(null);
    setEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('lyrix_playlists');
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
