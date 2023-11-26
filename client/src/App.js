import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Container from "./components/Container";
import ChoosePlaylist from "./components/ChoosePlaylist";
import LinkTransfer from "./components/LinkTransfer";
import Services from "./components/Services";
 
const App = () => {
 return (
   <div>
     <Routes>
       <Route exact path="/" element={<Services />} />
       <Route path="/choosePlaylists" element={<ChoosePlaylist />} />
       <Route path="/linkTransfer" element={<LinkTransfer />} />
       <Route path="/login" element={<div className="App cfb"><Container /></div>} />
       <Route path="/signup" element={<div className="App cfb"><Container /></div>} />
     </Routes>
   </div>
 );
};
 
export default App;