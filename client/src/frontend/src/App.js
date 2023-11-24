import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Playlist from './pages/playlist';
import Library from './pages/library';
import Services from './pages/services';

function App() {
  // function extractPlaylistID(url) {
  //   const match = url.match(/list=([a-zA-Z0-9_-]+)/);
  //   return match ? match[1] : null;
  // }

  // // Example usage:
  // const url = "https://music.youtube.com/playlist?list=PLRL8sOPn-ByF6a-yviGbmOmwrCuyveLxd";
  // const playlistID = extractPlaylistID(url);

  // console.log("Playlist ID:", playlistID);

  return (
    <Router>
      <Routes>
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </Router>
  );
}

export default App;
