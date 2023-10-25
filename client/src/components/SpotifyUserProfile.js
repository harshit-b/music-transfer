//Might be redundant

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

const SpotifyUserProfile = () => {
  const {userId} = useParams();
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    axios.get(
        `http://localhost:4000/spotify/userProfile?userId=${userId}`,
        {},
        {withCredentials: true})
        .then((res) => {
            setUserProfile(res.data.userProfile);
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
  }, [userId]);
  
  return (
    <div>
    {userProfile ? (
        <div>
            <h1> Welcome, {userProfile.display_name}</h1>
            <p>Email: {userProfile.email}</p>
        </div>
    ) : (
      <div> 
        <h1> You need to go back and sign in first :D</h1>
      </div>
      
    )}
</div>
  );
}

export default SpotifyUserProfile;