import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lyrixLogo from '../assets/lyrixLogo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
export default function Navbar() {
    const { email, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogoClick = () => {
        localStorage.removeItem('searchQuery'); // Clear stored query if you're using it
        navigate('/');
        window.location.reload(); // Force page reload to reset state
    };
    return (React.createElement("nav", { className: "navbar", style: {
            backgroundColor: '#004687',
        } },
        React.createElement("div", { className: "logo-container" },
            React.createElement("div", { onClick: handleLogoClick, style: { cursor: 'pointer' } },
                React.createElement("img", { src: lyrixLogo, alt: "Lyrix Logo", className: "lyrix-logo" }))),
        React.createElement("div", { className: "navbar-links" },
            React.createElement(Link, { to: "/playlists" }, "Playlists"),
            email ? (React.createElement(React.Fragment, null,
                React.createElement("span", null,
                    "Welcome, ",
                    email),
                React.createElement("button", { className: "logout-button", onClick: logout }, "Logout"))) : (React.createElement(React.Fragment, null,
                React.createElement(Link, { to: "/login" }, "Login"),
                React.createElement(Link, { to: "/signup" }, "Signup"))))));
}
