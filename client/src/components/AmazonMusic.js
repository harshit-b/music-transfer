import React, { useState } from 'react'

const AmazonMusic = (props) => {
    const [userProfile, setUserProfile] = useState(null)

    const baseUrl = 'http://localhost:4000';
    const endpoint = '/amazon/login';
    const queryParam = `userId=${props.userId}`;

    const url = baseUrl + endpoint + '?' + queryParam;

    const handleLogin = async () => {
        window.location.href = url
    }
    return (
        <div className = 'playlist_box'> 
            <button onClick={handleLogin}> Login to Amazon Music </button>
            {/* <a href={} id="LoginWithAmazon">
                <img
                border="0"
                alt="Login with Amazon"
                src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
                width="156"
                height="32"
                />
            </a> */}
        </div>
    )

}

export default AmazonMusic