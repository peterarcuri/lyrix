"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const AuthForm_1 = __importDefault(require("./AuthForm"));
const api_1 = require("../services/api");
const AuthContext_1 = require("../context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
// Mock dependencies
jest.mock('../services/api');
jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => (Object.assign(Object.assign({}, jest.requireActual('react-router-dom')), { useNavigate: jest.fn() })));
describe('AuthForm', () => {
    const mockSetAuth = jest.fn();
    const mockNavigate = jest.fn();
    beforeEach(() => {
        AuthContext_1.useAuth.mockReturnValue({ login: mockSetAuth });
        react_router_dom_1.useNavigate.mockReturnValue(mockNavigate);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('submits login form and sets auth', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock login response
        api_1.login.mockResolvedValue({
            data: { token: 'fake-token', email: 'test@example.com' },
        });
        (0, react_2.render)(react_1.default.createElement(AuthForm_1.default, { type: "login" }));
        // Fill in the form
        react_2.fireEvent.change(react_2.screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        react_2.fireEvent.change(react_2.screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });
        react_2.fireEvent.click(react_2.screen.getByRole('button', { name: /login/i }));
        yield (0, react_2.waitFor)(() => {
            expect(api_1.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mockSetAuth).toHaveBeenCalledWith('fake-token', 'test@example.com');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    }));
});
