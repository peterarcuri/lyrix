import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Playlists = () => {
  const { email } = useAuth();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/v1/playlists', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPlaylists(data);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div>
      <h1>Your Playlists</h1>
      {playlists.length === 0 ? (
        <p>No playlists available.</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist._id}>{playlist.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Playlists;
