const querystring = require('node:querystring')
const User = require("../models/userModel");
const axios = require('axios');
const client_id = "06d6e4c4bfd34e0ba2d776f2f18ffb09"
const redirect_uri = "http://localhost:4000/spotify/callback"
const client_secret = "b513d75dc33f4f78be7dbbfa852b13dc"

//Initiate OAuth flow - Spotify
//Input in the query - userId: ID of the user in mongoDB database
//userID used as the state 
module.exports.spotifyAuth = async (req, res) => {
    const state = req.query.userId;
    console.log("While logging in" + state)
    const scope = 'user-read-private user-read-email playlist-read-private';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope, 
        redirect_uri: redirect_uri,
        state: state
      }));
}

//Callback function getting response from spotify login API
//Response: code, state(userID) if accepted 
module.exports.spotifyCallback = async (req, res) => {
  try {
    var code = req.query.code || null;
    var userId = req.query.state || null;

    // Exchange the authorization code for an access token and refresh token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        code: code, // Assuming you have this code from the authorization callback
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
    });

    if (tokenResponse.status === 200) {
      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;
      const tokenExpiresIn = Math.floor(Date.now() / 1000) + tokenResponse.data.expires_in; 
      const filter = {_id : userId}
      const update = {spotifyAccessToken : accessToken, spotifyRefreshToken : refreshToken, spotifyTokenExpiresIn : tokenExpiresIn, spotifyLoggedIn : true }
      //Store Access Token and Refresh Token of user in database
      await User.findOneAndUpdate(filter, update);
      res.redirect(`http://localhost:3000/`)
      // res.redirect(`http://localhost:3000/spotify/userProfile/${userId}`)

    } else {
      res.status(tokenResponse.status).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//Function to check if user has already logged in to spotify or not 
//Input in query - userID
//userID to fetch accessToken
module.exports.checkIfLoggedInToSpotify = async(req, res) => {
  try{
    const userId = req.query.userId;
    const user = await User.findOne({_id: userId}).exec();
    
    if (user) {
      if (user.spotifyAccessToken) {
        res.json({userLoggedIntoSpotify: true})
      } else {
        res.json({userLoggedIntoSpotify: false})
      }
    } else {
      res.status(500).json({ error: 'User not Found' });
    }
  } catch(error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//Function to fetch playlist info of the user
//Input in query - userID
//userID to fetch accessToken
module.exports.spotifyUserPlaylists = async(req,res) => {
  try {
    const userId = req.query.userId;
    let accessToken = null;
    const user = await User.findOne({_id: userId}).exec();
    
    if (user) {
      accessToken = user.spotifyAccessToken;
      //If access token expired, use refresh token to get new access token and replace 
      if (isAccessTokenExpired(user.spotifyTokenExpiresIn)) {
        //Call function to call api to fetch new access token by inputting refresh token
        const {accessToken, expiresIn} = refreshToken(user.spotifyRefreshToken)
        await User.findOneAndUpdate({_id: userId}, {spotifyAccessToken : accessToken, spotifyTokenExpiresIn : expiresIn});
      } 
      // Now you can use `accessToken` to make authorized requests to Spotify's API
    } else {
      res.status(500).json({ error: 'Failed to fetch access token' });
    }

    // Make an API request to fetch the user's playlists information
    const userPlaylistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (userPlaylistsResponse.status === 200) {
      // Extract user playlists information
      const userPlaylists = userPlaylistsResponse.data;

      // Redirect the user to the frontend with user playlist info in query parameters
      res.json({userPlaylists});
    } else {
      res.status(userPlaylistsResponse.status).json({ error: 'Failed to fetch user profile' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//Function to fetch user info of the user
//A lot of same code as playlist function
// TODO: Refactor Code
module.exports.spotifyUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    let accessToken = null;
    const user = await User.findOne({_id: userId}).exec();
    
    if (user) {
      accessToken = user.spotifyAccessToken;
      if (isAccessTokenExpired(user.spotifyTokenExpiresIn)) {
        const {accessToken, expiresIn} = refreshToken(user.spotifyRefreshToken)
        await User.findOneAndUpdate({_id: userId}, {spotifyAccessToken : accessToken, spotifyTokenExpiresIn : expiresIn});
      } 
      // Now you can use `accessToken` to make authorized requests to Spotify's API
    } else {
      res.status(500).json({ error: 'Failed to fetch access token' });
    }

    // Make an API request to fetch the user's profile information
    const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (userProfileResponse.status === 200) {
      // Extract user profile information
      const userProfile = userProfileResponse.data;
      console.log(userProfile.data)
      // Redirect the user to the frontend with user info in query parameters
      res.json({userProfile});
    } else {
      res.status(userProfileResponse.status).json({ error: 'Failed to fetch user profile' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//function to check if access token has expired or not
//Logic: while authenticating user also store the time when access token will expire, 
//        if current time exceeds time stored in database, then token expired
function isAccessTokenExpired(spotifyTokenExpiresIn) {
  let result;
  Math.floor(Date.now() / 1000) < spotifyTokenExpiresIn ? result = false : result = true;
  return result;
}

// Helper function to refresh the access token using the refresh token
async function refreshToken(refreshToken) {
  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
    });

    if (tokenResponse.status === 200) {
      return {accessToken : tokenResponse.data.access_token, expiresIn : tokenResponse.data.expires_in};
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}
