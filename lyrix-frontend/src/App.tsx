import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import  Playlists  from './pages/Playlists';
import Navbar from './components/Navbar';
import { PlaylistProvider } from './context/PlaylistContext';


const App = () => {
  return (
    <Router>
      <PlaylistProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </AuthProvider>
      </PlaylistProvider>

    </Router>
  );
}

export default App;
