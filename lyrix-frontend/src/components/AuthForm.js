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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const api_1 = require("../services/api");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const AuthForm = ({ type }) => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const { login: setAuth } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        try {
            const res = type === 'login'
                ? yield (0, api_1.login)({ email, password })
                : yield (0, api_1.signup)({ email, password });
            setAuth(res.data.token, res.data.email);
            navigate('/');
        }
        catch (err) {
            alert(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Auth failed');
        }
    });
    return (react_1.default.createElement("div", { className: "auth-form-container" },
        react_1.default.createElement("form", { className: "auth-form", onSubmit: handleSubmit },
            react_1.default.createElement("h2", null, type === 'login' ? 'Login' : 'Signup'),
            react_1.default.createElement("input", { type: "email", className: "search-input", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }),
            react_1.default.createElement("input", { type: "password", className: "search-input", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true }),
            react_1.default.createElement("button", { type: "submit", className: "search-button" }, type === 'login' ? 'Login' : 'Signup'))));
};
exports.default = AuthForm;
