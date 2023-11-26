import React, { useEffect, useState } from 'react'
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

const Youtube = (props) => {
    const [playlistSelected, setPlaylistSelected] = useState([])
    const [playlistSelectedButton, setPlaylistSelectedButton] = useState([])
    const [userPlaylists, setUserPlaylists] = useState(null)
    const [userLoggedIntoYoutube, setUserLoggedIntoYoutube] = useState(false);

    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const endpoint = '/youtube/login';
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

    const handleLogin = async () => {
        window.location.href = url
    }

    useEffect(()=> {
        if (userLoggedIntoYoutube === false) {
            //API call to backend to check if user has logged into youtube or not
            //response: true or false 
            axios.get(
                `${baseUrl}/youtube/userLoggedIntoYoutube?userId=${props.userId}`)
                .then((res) => {
                    if (res.data.success) {
                        setUserLoggedIntoYoutube(res.data.success)
                        handleSuccess(res.data.message);
                    }
                    else handleError(res.data.message)
                })
                .catch((error) => {
                    console.error("Error determining if user logged into youtube: ", error)
                });
        }

        // Fetch playlist info and user profile info only when user has logged into spotify
        if (userLoggedIntoYoutube) {
            //API call to backend to fetch playlist info from backend
            axios.get(
                `${baseUrl}/youtube/playlists?userId=${props.userId}`)
                .then((res) => {
                    if (res.data.success) {
                        setUserPlaylists(res.data.message);
                        setPlaylistSelectedButton(new Array(res.data.message.length).fill(false));
                    } else handleError(res.data.message);
                })
                .catch((error) => {
                    console.error('Error fetching user playlist:', error);
                    handleError("Gotta login to youtube!");
                });
        }
    }, [userLoggedIntoYoutube])

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
            playlistSelected.map(async(playlist) => {
                const { data } = await axios.post(
                    `${baseUrl}/transferPlaylist`,
                    {
                        userId : props.userId,
                        sourceApp : "Youtube",
                        destinationApp : "Spotify",
                        playlist : playlist.playlistId,
                        name: playlist.playlistName
                    },
                    {withCredentials: true}
                );
                const {success, message} = data;
                if (success) {
                    handleSuccess(message + " " + playlist);
                } else {
                    handleError(message + " " + playlist);
                }
            })
        } catch (error) {
            console.log(error)
        }
        setPlaylistSelected([]);
        setPlaylistSelectedButton(new Array(playlistSelectedButton.length).fill(false));
    }

    return (
        <PlaylistBox> 
            {(userLoggedIntoYoutube && userPlaylists) ? (
                <div>
                    <h5>Youtube Playlists: </h5>
                    {userPlaylists.map((playlist, index) => {
                       return (<div key={index}><PlaylistButton style={{ border: playlistSelectedButton[index] ? "2px solid white" : "none"}} type="button" onClick={() => handlePlaylistSelected(playlist.id, playlist.snippet.title, index)}>{playlist.snippet.title}</PlaylistButton> <br/></div> )
                    })}
                    <br></br>
                    <Button onClick={handleSubmit}> TRANSFER </Button>
                </div>
            ) : (
                <button onClick={handleLogin}>Login to Youtube</button>
      
            )}
        </PlaylistBox>
    )

}

export default Youtube