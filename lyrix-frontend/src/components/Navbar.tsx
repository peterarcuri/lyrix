import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lyrixLogo from '../assets/lyrixLogo.png';
import { useNavigate } from 'react-router-dom';
import { getPlaylists } from '../utils/playlistStorage';
import React from 'react';

export default function Navbar() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const playlists = getPlaylists();
    const token = localStorage.getItem('token');

    try {
      if (token) {
        await fetch('/api/v1/playlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(playlists),
        });
      }
    } catch (error) {
      console.error('Failed to save playlists:', error);
    }

    localStorage.removeItem('lyrix_playlists');
    localStorage.removeItem('token');
    localStorage.removeItem('searchQuery');

    logout(); // your auth context
    navigate('/'); // ✅ this is a function call
    window.location.reload();
  };

  const handleLogoClick = () => {
    localStorage.removeItem('searchQuery'); // Clear stored query if you're using it
    navigate('/');
    window.location.reload(); // Force page reload to reset state
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
