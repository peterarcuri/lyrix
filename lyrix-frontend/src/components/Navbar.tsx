import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lyrixLogo from '../assets/lyrixLogo.png';

export default function Navbar() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
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