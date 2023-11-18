import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";

// userId: ID of the user in our database that has logged in 
// userID is sent into the component by props
const Spotify = (props) => {
    const [playlistSelected, setPlaylistSelected] = useState([])
    const [playlistSelectedButton, setPlaylistSelectedButton] = useState([])
    const [userLoggedIntoSpotify, setUserLoggedIntoSpotify] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState(null);

    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const endpoint = '/spotify/login';
    const queryParam = `userId=${props.userId}`;

    const url = baseUrl + endpoint + '?' + queryParam;

    const handleError = (err) => 
    toast.error(err, {
      position: "bottom-left",
    });

    const handleSuccess = (msg) => 
    toast.success(msg, {
      position: "bottom-right",
    })

    const handlePlaylistSelected = (id, name, index) => {
        if (playlistSelected.indexOf(id) === -1) {
            setPlaylistSelected([...playlistSelected, {playlistId: id, playlistName: name}])
            
        } else {
            setPlaylistSelected(playlistSelected.filter(playlist => playlist !==id))
        }
        const newPlaylistSelectedButton = playlistSelectedButton.map((b, i) => {
            if (i===index) {
                return !b
            } else {
                return b
            }
        })
        setPlaylistSelectedButton(newPlaylistSelectedButton)
    }

    const handleSubmit = async() => {
        try {
            playlistSelected.map(async (playlist) => {
                const { data } = await axios.post(
                    `${baseUrl}/transferPlaylist`,
                    {
                        userId : props.userId,
                        sourceApp : "Spotify",
                        destinationApp : "Youtube",
                        playlist : playlist.playlistId,
                        name: playlist.playlistName
                    },
                    {withCredentials: true}
                );
                const {success, message} = data;
                if (success) {
                    handleSuccess(message);
                } else {
                    handleError(message);
                }
            })
        } catch (error) {
            console.log(error)
        }
        setPlaylistSelected([]);
        setPlaylistSelectedButton(new Array(playlistSelectedButton.length).fill(false));
    }

    //TODO: Harshit - try to do all in one api call
    useEffect(() => {
        if (props.userId != null) {
            //API call to backend to check if user has logged into spotify or not
            //response: true or false 
            axios.get(
                `${baseUrl}/spotify/userLoggedIntoSpotify?userId=${props.userId}`)
                .then((res) => {
                    if (res.data.success) {
                        setUserLoggedIntoSpotify(res.data.success)
                        handleSuccess(res.data.message)
                    } else {
                        handleError(res.data.message)
                    }
                })
                // .catch((error) => {
                //     console.error("Error determining if user logged into spotify: ", error)
                //     handleError("Have to log in to spotify again :)")
                // });
        }
        // Fetch playlist info and user profile info only when user has logged into spotify
        if (userLoggedIntoSpotify) {
            //API call to backend to fetch playlist info from backend
            axios.get(
                `${baseUrl}/spotify/userPlaylists?userId=${props.userId}`)
                .then((res) => {
                    if (res.data.success) {
                        setUserPlaylists(res.data.message);
                        setPlaylistSelectedButton(new Array(res.data.message.items.length).fill(false))
                    } else {
                        handleError(res.data.message)
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user playlist:', error);
                    handleError("Have to log in to spotify again :)")
                });
            
            //API call to backend to fetch user profile from backend ~ can be redundant later
            axios.get(
                `${baseUrl}/spotify/userProfile?userId=${props.userId}`)
                .then((res) => {
                    if (res.data.success) setUserProfile(res.data.message);
                    else handleError(res.data.message);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    handleError("Have to log in to spotify again :)")
                });
        } 
    }, [props.userId, userLoggedIntoSpotify, baseUrl]);

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
                    {userPlaylists.items.map((playlist, index) => {
                       return (<div key={index}><button style={{backgroundColor : playlistSelectedButton[index] ? "rgb(103, 255, 73)" : "rgb(32, 114, 59)"}} type="button" onClick={() => handlePlaylistSelected(playlist.id, playlist.name, index)}>{playlist.name}</button> <br/></div> )
                    })}
                    <br></br>
                    <button style={{backgroundColor : "rgb(27, 73, 83)"}} onClick={handleSubmit}> TRANSFER </button>
                </div>
            ) : (
                <button onClick={handleLogin}>Login to Spotify</button>
      
            )}
        </div>
    )
}

export default Spotify;