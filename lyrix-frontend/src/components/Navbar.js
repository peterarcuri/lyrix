var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lyrixLogo from '../assets/lyrixLogo.png';
import { useNavigate } from 'react-router-dom';
import { getPlaylists } from '../utils/playlistStorage';
import React from 'react';
export default function Navbar() {
    const { email, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => __awaiter(this, void 0, void 0, function* () {
        const playlists = getPlaylists();
        const token = localStorage.getItem('token');
        try {
            if (token && playlists.length > 0) {
                yield fetch('/api/playlists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(playlists),
                });
            }
        }
        catch (error) {
            console.error('Failed to save playlists:', error);
        }
        localStorage.removeItem('lyrix_playlists');
        localStorage.removeItem('token');
        localStorage.removeItem('searchQuery');
        logout(); // your auth context
        navigate('/'); // ✅ this is a function call
        window.location.reload();
    });
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
                React.createElement("button", { className: "logout-button", onClick: handleLogout }, "Logout"))) : (React.createElement(React.Fragment, null,
                React.createElement(Link, { to: "/login" }, "Login"),
                React.createElement(Link, { to: "/signup" }, "Signup"))))));
}
