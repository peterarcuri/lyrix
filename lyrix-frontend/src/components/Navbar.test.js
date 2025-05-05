"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const Navbar_1 = __importDefault(require("./Navbar"));
const AuthContext_1 = require("../context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
// Mock useAuth
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));
// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => (Object.assign(Object.assign({}, jest.requireActual('react-router-dom')), { useNavigate: () => mockNavigate })));
describe('Navbar', () => {
    const mockLogout = jest.fn();
    beforeEach(() => {
        AuthContext_1.useAuth.mockReturnValue({
            email: 'test@example.com',
            logout: mockLogout,
        });
        jest.spyOn(window, 'location', 'get').mockReturnValue(Object.assign(Object.assign({}, window.location), { reload: jest.fn() }));
        localStorage.setItem('searchQuery', 'hello');
    });
    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });
    it('renders user email and logout button', () => {
        (0, react_2.render)(react_1.default.createElement(Navbar_1.default, null), { wrapper: react_router_dom_1.MemoryRouter });
        expect(react_2.screen.getByText(/Welcome, test@example.com/)).toBeInTheDocument();
        expect(react_2.screen.getByText('Logout')).toBeInTheDocument();
    });
    it('clears searchQuery and navigates home on logo click', () => {
        (0, react_2.render)(react_1.default.createElement(Navbar_1.default, null), { wrapper: react_router_dom_1.MemoryRouter });
        const logo = react_2.screen.getByAltText('Lyrix Logo');
        react_2.fireEvent.click(logo);
        expect(localStorage.getItem('searchQuery')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(window.location.reload).toHaveBeenCalled();
    });
});
