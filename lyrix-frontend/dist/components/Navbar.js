import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import lyrixLogo from '../assets/lyrixLogo.png';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
    const { email, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogoClick = () => {
        localStorage.removeItem('searchQuery'); // Clear stored query if you're using it
        navigate('/');
        window.location.reload(); // Force page reload to reset state
    };
    return (_jsxs("nav", { className: "navbar", style: {
            backgroundColor: '#004687',
        }, children: [_jsx("div", { className: "logo-container", children: _jsx("div", { onClick: handleLogoClick, style: { cursor: 'pointer' }, children: _jsx("img", { src: lyrixLogo, alt: "Lyrix Logo", className: "lyrix-logo" }) }) }), _jsxs("div", { className: "navbar-links", children: [_jsx(Link, { to: "/playlists", children: "Playlists" }), email ? (_jsxs(_Fragment, { children: [_jsxs("span", { children: ["Welcome, ", email] }), _jsx("button", { className: "logout-button", onClick: logout, children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", children: "Login" }), _jsx(Link, { to: "/signup", children: "Signup" })] }))] })] }));
}
