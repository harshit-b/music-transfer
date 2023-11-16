import React, { useEffect, useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";

const Youtube = (props) => {
    const [playlistSelected, setPlaylistSelected] = useState([])
    const [playlistSelectedButton, setPlaylistSelectedButton] = useState([])
    const [userPlaylists, setUserPlaylists] = useState(null)
    const [userLoggedIntoYoutube, setUserLoggedIntoYoutube] = useState(false);

    const baseUrl = 'http://localhost:4000';
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
        if (props.userId != null) {
            //API call to backend to check if user has logged into youtube or not
            //response: true or false 
            axios.get(
                `http://localhost:4000/youtube/userLoggedIntoYoutube?userId=${props.userId}`)
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
                `http://localhost:4000/youtube/playlists?userId=${props.userId}`)
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
    }, [props.userId, userLoggedIntoYoutube])

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
                    "http://localhost:4000/transferPlaylist",
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
        <div className = 'playlist_box'> 
            {(userLoggedIntoYoutube && userPlaylists) ? (
                <div>
                    <h5>Youtube</h5>
                    <h6>Playlists: </h6>
                    {userPlaylists.map((playlist, index) => {
                       return (<div key={index}><button style={{backgroundColor : playlistSelectedButton[index] ? "rgb(103, 255, 73)" : "rgb(32, 114, 59)"}} type="button" onClick={() => handlePlaylistSelected(playlist.id, playlist.snippet.title, index)}>{playlist.snippet.title}</button> <br/></div> )
                    })}
                    <br></br>
                    <button style={{backgroundColor : "rgb(27, 73, 83)"}} onClick={handleSubmit}> TRANSFER </button>
                </div>
            ) : (
                <button onClick={handleLogin}>Login to Youtube</button>
      
            )}
        </div>
    )

}

export default Youtube