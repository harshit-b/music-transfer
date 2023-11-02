import React, { useEffect, useState } from 'react'
import axios from "axios";

const Youtube = (props) => {
    const [userPlaylists, setUserPlaylists] = useState(null)
    const [userLoggedIntoYoutube, setUserLoggedIntoYoutube] = useState(false);

    const baseUrl = 'http://localhost:4000';
    const endpoint = '/youtube/login';
    const queryParam = `userId=${props.userId}`;

    const url = baseUrl + endpoint + '?' + queryParam;

    const handleLogin = async () => {
        window.location.href = url
    }

    useEffect(()=> {
        if (props.userId != null) {
            //API call to backend to check if user has logged into youtube or not
            //response: true or false 
            axios.get(
                `http://localhost:4000/spotify/userLoggedIntoYoutube?userId=${props.userId}`)
                .then((res) => {
                    setUserLoggedIntoYoutube(res.data.userLoggedIntoYoutube)
                })
                .catch((error) => {
                    console.error("Error determining if user logged into youtube: ", error)
                });
        }

        // Fetch playlist info and user profile info only when user has logged into spotify
        if (userLoggedIntoYoutube) {
            //API call to backend to fetch playlist info from backend
            axios.get(
                `http://localhost:4000/youtube/playlists?userId=${props.userId}`)
                .then((res) => {
                    setUserPlaylists(res.data.playlists);
                })
                .catch((error) => {
                    console.error('Error fetching user playlist:', error);
                });
        }
    }, [props.userId, userLoggedIntoYoutube])

    return (
        <div className = 'playlist_box'> 
            {(userLoggedIntoYoutube && userPlaylists) ? (
                <div>
                    <h5>Youtube</h5>
                    <h6>Playlists: </h6>
                    {userPlaylists.map((playlist, index) => {
                       return (<div key={index}><button>{playlist.snippet.title}</button> <br/></div> )
                    })}
                </div>
            ) : (
                <button onClick={handleLogin}>Login to Youtube</button>
      
            )}
            
        </div>
    )

}

export default Youtube