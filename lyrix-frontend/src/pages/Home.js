import React from 'react';
import SongSearch from '../components/SongSearch';
export default function Home() {
    return (React.createElement("div", { className: "home-container" },
        React.createElement("div", { className: "home-content" },
            React.createElement(SongSearch, null))));
}
