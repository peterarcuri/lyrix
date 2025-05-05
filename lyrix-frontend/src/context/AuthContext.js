"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children, }) => {
    const [token, setToken] = (0, react_1.useState)(localStorage.getItem('token'));
    const [email, setEmail] = (0, react_1.useState)(localStorage.getItem('email'));
    const login = (token, email) => {
        setToken(token);
        setEmail(email);
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
    };
    const logout = () => {
        setToken(null);
        setEmail(null);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
    };
    return (react_1.default.createElement(AuthContext.Provider, { value: { token, email, login, logout } }, children));
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
exports.useAuth = useAuth;
