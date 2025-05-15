import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lyrixLogo from '../assets/lyrixLogo.png';

export default function Navbar() {
  const { email, logout, playlists } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout button clicked. Current playlists:', playlists);
    
    const token = localStorage.getItem('token');
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    try {
      if (token && playlists && playlists.length > 0) {
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
      } else {
        console.log('No playlists to save before logout');
      }
    } catch (error) {
      console.error('Failed to save playlists:', error);
    }

    await logout(); // Call the logout function from AuthContext
    navigate('/');
  };

  const handleLogoClick = () => {
    localStorage.removeItem('searchQuery');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar" style={{ backgroundColor: '#004687' }}>
      <div className="logo-container">
        <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={lyrixLogo} alt="Lyrix Logo" className="lyrix-logo" />
        </div>
      </div>
      <div className="navbar-links">
        <Link to="/playlists">Playlists</Link>
        {email ? (
          <>
            <span>Welcome, {email}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}