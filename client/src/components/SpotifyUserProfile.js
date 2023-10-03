import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function SpotifyUserProfile() {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Extract user info from query parameters in the URL
    const searchParams = new URLSearchParams(location.search);
    setName(searchParams.get('name') || '');
    setEmail(searchParams.get('email') || '');
  }, [location.search]);

  return (
    <div className="home_page">
      <h4>User Profile</h4>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </div>
  );
}

export default SpotifyUserProfile;