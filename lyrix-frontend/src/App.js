import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import Playlists from './pages/Playlists';
import Navbar from './components/Navbar';
const App = () => {
    return (React.createElement(Router, null,
        React.createElement(AuthProvider, null,
            React.createElement(Navbar, null),
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Home, null) }),
                React.createElement(Route, { path: "/signup", element: React.createElement(Signup, null) }),
                React.createElement(Route, { path: "/login", element: React.createElement(Login, null) }),
                React.createElement(Route, { path: "/playlists", element: React.createElement(Playlists, null) })))));
};
export default App;
