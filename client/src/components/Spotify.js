import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

const PlaylistBox = styled.div`
    display: flex;
    justify-content: center;
    background: #5C5C5C;
    height: fit-content;
    text-align:center;
    align-items: center;
    margin: 1rem;
    border-radius: 1em;
    border-spacing: 1em;
    padding: 1em;
    @media (max-width: 768px) {
        width: 40%;
    }
`
const Button = styled.button`
    cursor: pointer;
    border-radius: 5rem;
    border: none;
    background: white;
    color: black;
    font-size: 17px;
`
const PlaylistButton = styled.button`
    cursor: pointer;
    border-radius: 5rem;
    color: white;
    margin: 3px;
    font-size: 14px;
    background: #1E1F22;
`

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
            handleSuccess("Transfer Started!")
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
        if (userLoggedIntoSpotify === false) {
            // console.log("Entered function")
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
    }, [userLoggedIntoSpotify]);

    const handleLogin = async () => {
        window.location.href = url
    }

// Display 'login with spotify if' userLoggedIntoSpotify is false
// Populate user's spotify playlists if userLoggedIntoSpotify && userProfile && userPlaylists is true
    return (
        // <div className='playlist_box'>
        <PlaylistBox>
            {(userLoggedIntoSpotify && userProfile && userPlaylists) ? (
                <div>
                    <h5>{userProfile.display_name}</h5>
                    <h5>Spotify Playlists: </h5>
                    {userPlaylists.items.map((playlist, index) => {
                       return (<div key={index}><PlaylistButton style={{border: playlistSelectedButton[index] ? "2px solid white" : "none"}} type="button" onClick={() => handlePlaylistSelected(playlist.id, playlist.name, index)}>{playlist.name}</PlaylistButton> <br/></div> )
                    })}
                    <br></br>
                    <Button  onClick={handleSubmit}> TRANSFER </Button>
                </div>
            ) : (
                <button onClick={handleLogin}>Login to Spotify</button>
      
            )}
        </PlaylistBox>
        // </div>
    )
}

export default Spotify;