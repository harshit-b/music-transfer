import React, { useEffect, useState } from 'react';
import axios from "axios";

const Spotify = (props) => {
    const [userProfile, setUserProfile] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState(null);

    const baseUrl = 'http://localhost:4000';
    const endpoint = '/spotify/login';
    const queryParam = `userId=${props.userId}`;

    const url = baseUrl + endpoint + '?' + queryParam;

    useEffect(() => {
        if (props.userId != null) {
            axios.get(
                `http://localhost:4000/spotify/userPlaylists?userId=${props.userId}`)
                .then((res) => {
                    setUserPlaylists(res.data.userPlaylists);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            
                axios.get(
                    `http://localhost:4000/spotify/userProfile?userId=${props.userId}`)
                    .then((res) => {
                        setUserProfile(res.data.userProfile);
                    })
                    .catch((error) => {
                        console.error('Error fetching user data:', error);
                    });
        } 
    }, [props.userId]);

    const handleLogin = async () => {
        window.location.href = url
    }


    return (
        <div>
            {(userPlaylists && userProfile) ? (
                <div>
                    <h5>Spotify, {userProfile.display_name}</h5>
                    <h6>Playlists: </h6>
                    {userPlaylists.items.map(playlist => {
                       return (<div className='playlist_box'><button>{playlist.name}</button> <br/></div> )
                    })}
                </div>
            ) : (
                <button onClick={handleLogin}>Login with Spotify</button>
      
            )}
        </div>
    )
}

export default Spotify;