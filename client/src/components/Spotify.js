import React, { useEffect, useState } from 'react';
import axios from "axios";

// userId: ID of the user in our database that has logged in 
// userID is sent into the component by props
const Spotify = (props) => {
    const [userLoggedIntoSpotify, setUserLoggedIntoSpotify] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState(null);

    const baseUrl = 'http://localhost:4000';
    const endpoint = '/spotify/login';
    const queryParam = `userId=${props.userId}`;

    const url = baseUrl + endpoint + '?' + queryParam;

    //TODO: Harshit - try to do all in one api call
    useEffect(() => {
        if (props.userId != null) {
            //API call to backend to check if user has logged into spotify or not
            //response: true or false 
            axios.get(
                `http://localhost:4000/spotify/userLoggedIntoSpotify?userId=${props.userId}`)
                .then((res) => {
                    console.log(res.data.userLoggedIntoSpotify)
                    setUserLoggedIntoSpotify(res.data.userLoggedIntoSpotify)
                })
                .catch((error) => {
                    console.error("Error determining if user logged into spotify: ", error)
                });
        }
        // Fetch playlist info and user profile info only when user has logged into spotify
        if (userLoggedIntoSpotify) {
            //API call to backend to fetch playlist info from backend
            axios.get(
                `http://localhost:4000/spotify/userPlaylists?userId=${props.userId}`)
                .then((res) => {
                    setUserPlaylists(res.data.userPlaylists);
                })
                .catch((error) => {
                    console.error('Error fetching user playlist:', error);
                });
            
            //API call to backend to fetch user profile from backend ~ can be redundant later
            axios.get(
                `http://localhost:4000/spotify/userProfile?userId=${props.userId}`)
                .then((res) => {
                    setUserProfile(res.data.userProfile);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        } 
    }, [props.userId, userLoggedIntoSpotify]);

    const handleLogin = async () => {
        window.location.href = url
    }

// Display 'login with spotify if' userLoggedIntoSpotify is false
// Populate user's spotify playlists if userLoggedIntoSpotify && userProfile && userPlaylists is true
    return (
        <div className='playlist_box'>
            {(userLoggedIntoSpotify && userProfile && userPlaylists) ? (
                <div>
                    <h5>Spotify, {userProfile.display_name}</h5>
                    <h6>Playlists: </h6>
                    {userPlaylists.items.map(playlist => {
                       return (<div><button>{playlist.name}</button> <br/></div> )
                    })}
                </div>
            ) : (
                <button onClick={handleLogin}>Login with Spotify</button>
      
            )}
        </div>
    )
}

export default Spotify;