import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { login, signup } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const AuthForm = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login: setAuth } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = type === 'login'
                ? await login({ email, password })
                : await signup({ email, password });
            setAuth(res.data.token, res.data.email);
            navigate('/');
        }
        catch (err) {
            alert(err.response?.data?.message || 'Auth failed');
        }
    };
    return (_jsx("div", { className: "auth-form-container", children: _jsxs("form", { className: "auth-form", onSubmit: handleSubmit, children: [_jsx("h2", { children: type === 'login' ? 'Login' : 'Signup' }), _jsx("input", { type: "email", className: "search-input", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { type: "password", className: "search-input", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { type: "submit", className: "search-button", children: type === 'login' ? 'Login' : 'Signup' })] }) }));
};
