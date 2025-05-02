import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import Playlists from './pages/Playlists';
import Navbar from './components/Navbar';
import React from 'react';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
