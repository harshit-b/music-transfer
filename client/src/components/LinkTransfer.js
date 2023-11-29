import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "styled-components"
import Navbar from "./Navbar"
import { toast } from "react-toastify";
import { ToastContainer} from "react-toastify";
import axios from "axios";

const MainArea = styled.div`
    display: flex;
    background: #1E1F22;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    align-items: center;
    justify-content: top;
`
const Title = styled.h1`
    margin-top: 4em;
    color: white;
    font-size: 40px;
    @media (max-width: 768px) {
        margin-top: 12vh;
    }
`
const ServicesSection = styled.div`
    display: flex;
    margin-top: 1rem;
    flex-direction: row;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: start;
    }
    
`
const MusicProvider1 = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 25vh;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    text-decoration: none;
    background: #5C5C5C;
    padding: 15px;
    overflow: hidden;`
const MusicProvider2 = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 25vh;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    text-decoration: none;
    background: #5C5C5C;
    padding: 15px;
    overflow: hidden;`

const Input = styled.input`
    width: 75%;
    height: 30px;
    margin: 10px;
    border-radius: 5px;
    border: none;
    background: #1E1F22;
    color: white;
    transition: background-color 5000s ease-in-out 0s;
    &:-webkit-autofill {
        -webkit-text-fill-color: white !important; // Override text color
        -webkit-box-shadow: 0 0 0px 1000px #1E1F22 inset; // Trick to override background color
        transition: background-color 5000s ease-in-out 0s;
    }
`
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    height: fit-content;
    text-align:center;
    align-items: center;
    margin: 2rem;
    @media (max-width: 768px) {
        flex-direction: row;
        width: 40%;
    }`
const Description = styled.p`
    color: white;
    font-size: 20px;
    @media (max-width: 768px) {
        display: flex;
        position: absolute;
        width: 30%;
        right: 15%;
    }`

const Start = styled.button`
    background: white;
    color: black;
    border: none;
    border-radius: 10px;
    width: 10%;
    height: 80px;
    font-size: 20px;
    cursor: pointer;
    &:hover {
        background: #60C3EE;
        translate: scale(1.1);
        transform: scale(1.1);
    }
    @media (max-width: 768px) {
        width: 40%;
        margin-left: 25%;
    }`

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Playlist = () => {
    const navigate = useNavigate();
    const [link, setLink] = useState('');
    const [sourceApp, setSourceApp] = useState('')
    const [playlistName, setPlaylistName] = useState('')
    const [destinationApp, setDestinationApp] = useState('')
    const [cookies, removeCookie] = useCookies([]);
    const [userId, setUserId] = useState(null);

    const verifyCookie = async () => {
        if (!cookies.token) {
          navigate("/login");
        }
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}`,
          {},
          { withCredentials: true }
        );
        const { status, user, userId } = data;
        setUserId(userId);
        return status
          ? toast(`Oooh ${user} is ready to transfer some playlists!!`, {
              position: "top-right",
            })
          : (removeCookie("token"), 
                // {domain : process.env.REACT_APP_DOMAIN, sameSite:'none', secure:true}), 
                navigate("/login"));
    };

    useEffect(() => {
        verifyCookie();
      }, []);

    const extractPlaylistIDYoutube = (url) => {
        const match = url.match(/list=([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    }

    const extractPlaylistIDSpotify = (url) => {
        const match = url.match(/playlist\/([a-zA-z0-9]+)/);
        return match ? match[1] : null;
    }

    const handleError = (err) => 
    toast.error(err, {
      position: "bottom-left",
    });

    const handleSuccess = (msg) => 
    toast.success(msg, {
      position: "bottom-right",
    })

    const handleSubmit = async() => {
        if (!link) {
            handleError("No link provided :(")
        } else if (!playlistName) {
            handleError("No Playlist name provided :(")
        } else if (!sourceApp) {
            handleError("Select a source music provider!")
        } else if (!destinationApp) {
            handleError("Select a target music provider!")
        } else if (sourceApp === destinationApp) {
            handleError("Cannot transfer to the same music provider :(");
        } else {
            let playlistID;
            if (sourceApp === "Youtube") playlistID = extractPlaylistIDYoutube(link);
            else if (sourceApp === "Spotify") playlistID = extractPlaylistIDSpotify(link)
            if (!playlistID) handleError("Could not fetch playlist ID :(");
            else {
                handleSuccess("Transfer Started!")
                const { data } = await axios.post(
                    `${baseUrl}/transferPlaylist`,
                    {
                        userId : userId,
                        sourceApp : sourceApp,
                        destinationApp : destinationApp,
                        playlist : playlistID,
                        name: playlistName,
                        link: true,
                    },
                    {withCredentials: true}
                );
                const {success, message} = data;
                if (success) {
                    handleSuccess(message);
                } else {
                    handleError(message);
                }
            }
        } 
        
    }

    return (
        <MainArea>
            <Navbar/>
            <Title>Playlist Transfer</Title>
            <ServicesSection>
                <Container>
                    <MusicProvider1>
                        <Input type="text" placeholder="Link Here" value={link} onChange={(e) => setLink(e.target.value)}/>
                        <select 
                            value={sourceApp} 
                            onChange={(e) => setSourceApp(e.target.value)} 
                            style={{ width: '75%', height: '30px', borderRadius: '5px', background: '#1E1F22', color: 'white', border: 'none', marginTop: '10px' }}
                        >
                            <option value="">Select Music Provider</option>
                            <option value="Spotify">Spotify</option>
                            <option value="Youtube">YouTube Music</option>
                        </select>
                    </MusicProvider1>
                    <Description>Enter a link to the playlist you want to transfer</Description>
                </Container>
                <Container>
                    <MusicProvider2>
                    <Input type="text" placeholder="Name for playlist" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
                        <select 
                            value={destinationApp} 
                            onChange={(e) => setDestinationApp(e.target.value)} 
                            style={{ width: '75%', height: '30px', borderRadius: '5px', background: '#1E1F22', color: 'white', border: 'none', marginTop: '10px' }}
                        >
                            <option value="">Select Music Provider</option>
                            <option value="Spotify">Spotify</option>
                            <option value="Youtube">YouTube Music</option>
                        </select>
                    </MusicProvider2>
                    <Description>The music provider you are transferring to</Description>
                </Container>
            </ServicesSection>
            <Start onClick={handleSubmit}>Start Transfer</Start>
            <ToastContainer />
        </MainArea>
    )
}

export default Playlist