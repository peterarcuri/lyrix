"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const lyrixLogo_png_1 = __importDefault(require("../assets/lyrixLogo.png"));
const react_router_dom_2 = require("react-router-dom");
const react_1 = __importDefault(require("react"));
function Navbar() {
    const { email, logout } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_2.useNavigate)();
    const handleLogoClick = () => {
        localStorage.removeItem('searchQuery'); // Clear stored query if you're using it
        navigate('/');
        window.location.reload(); // Force page reload to reset state
    };
    return (react_1.default.createElement("nav", { className: "navbar", style: {
            backgroundColor: '#004687',
        } },
        react_1.default.createElement("div", { className: "logo-container" },
            react_1.default.createElement("div", { onClick: handleLogoClick, style: { cursor: 'pointer' } },
                react_1.default.createElement("img", { src: lyrixLogo_png_1.default, alt: "Lyrix Logo", className: "lyrix-logo" }))),
        react_1.default.createElement("div", { className: "navbar-links" },
            react_1.default.createElement(react_router_dom_1.Link, { to: "/playlists" }, "Playlists"),
            email ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("span", null,
                    "Welcome, ",
                    email),
                react_1.default.createElement("button", { className: "logout-button", onClick: logout }, "Logout"))) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_router_dom_1.Link, { to: "/login" }, "Login"),
                react_1.default.createElement(react_router_dom_1.Link, { to: "/signup" }, "Signup"))))));
}
