import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";

const Spotify = () => {
    const [userProfile, setUserProfile] = useState(null);

    const handleLogin = async () => {
        // try {
        //     // Make a request to your backend to initiate Spotify authentication
        //     const response = await axios.get('/spotify/login');
        //     // Redirect the user to the Spotify authorization URL received from your backend
        //     window.location.href = response.data.spotifyAuthUrl;
        // } catch (error) {
        //     console.error('Error initiating Spotify login:', error);
        // }

        window.location.href = 'http://localhost:4000/spotify/login'
    }

    // useEffect(() => {
    //     axios.get(
    //         "https://localhost:4000/spotify/userProfile",
    //         {},
    //         {withCredentials: true})
    //         .then((res) => {
    //             setUserProfile(res.data.userProfile);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching user data:', error);
    //         });
    // }, []);

    return (
        <div>
            {/* {userProfile ? (
                <div>
                    <h1> Welcome, {userProfile.display_name}</h1>
                    <p>Email: {userProfile.email}</p>
                    <img src={userProfile.images[0].url} alt="User Profile" />
                </div>
            ) : ( */}
                <button onClick={handleLogin}> Login with Spotify </button>
            {/* )} */}
        </div>
    )
}

export default Spotify;