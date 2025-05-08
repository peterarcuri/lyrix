var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react';
import { login, signup } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const AuthForm = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login: setAuth } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        try {
            const res = type === 'login'
                ? yield login({ email, password })
                : yield signup({ email, password });
            setAuth(res.data.token, res.data.email);
            navigate('/');
        }
        catch (err) {
            alert(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Auth failed');
        }
    });
    return (React.createElement("div", { className: "auth-form-container" },
        React.createElement("form", { className: "auth-form", onSubmit: handleSubmit },
            React.createElement("h2", null, type === 'login' ? 'Login' : 'Signup'),
            React.createElement("input", { type: "email", className: "search-input", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }),
            React.createElement("input", { type: "password", className: "search-input", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true }),
            React.createElement("button", { type: "submit", className: "search-button" }, type === 'login' ? 'Login' : 'Signup'))));
};
export default AuthForm;
