// MenuComponent.jsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Styled components
const MenuContainer = styled.div`
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: row;
    padding-right: 20px;
    cursor: pointer;
`;

const MenuItem = styled.div`
  color: black;
  font-size: 22px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  ${'' /* text-align: center; */}
  padding: 11px;
  cursor: pointer; // Changes cursor to pointer to indicate clickable items
  transition: background-color 0.3s ease; // Smooth transition for hover effect

  &:hover {
    background-color: #1E1F22; // Darken item background on hover
  }
`;

// Uncomment below to implement 'useNavigate
/*
// React component
const MenuComponent = () => {
    const navigate = useNavigate(); // Hook for navigation
  
    // Event handler for menu item clicks
    const handleMenuClick = (path) => {
      navigate(path); // Navigate to the specified path
    };
  */

// React component for viusal testing
const MenuComponent = () => {
  // Dummy click handler for visual feedback
  const navigate = useNavigate(); // Hook for navigation
  const handleMenuClick = (path) => {
    // For now, we're just logging to the console for visual testing
    navigate(path); // Navigate to the specified path
  };

  return (
    <MenuContainer>
      <MenuItem onClick={() => handleMenuClick('/')}>Home</MenuItem>
      <MenuItem onClick={() => handleMenuClick('/linkTransfer')}>Link Transfer</MenuItem>
      <MenuItem onClick={() => handleMenuClick('/choosePlaylists')}>Choose Playlist</MenuItem>
      {/* <MenuItem onClick={() => handleMenuClick('Profile')}>Profile</MenuItem> */}
      {/* <MenuItem onClick={() => handleMenuClick('Logout')}>Logout</MenuItem> */}
    </MenuContainer>
  );
};

export default MenuComponent;