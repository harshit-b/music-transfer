const querystring = require('querystring')
const User = require("../models/userModel");
const axios = require('axios');
const client_id = "06d6e4c4bfd34e0ba2d776f2f18ffb09"
const redirect_uri = `${process.env.BACKEND_URL}/spotify/callback`
const client_secret = "b513d75dc33f4f78be7dbbfa852b13dc"

//Initiate OAuth flow - Spotify
//Input in the query - userId: ID of the user in mongoDB database
//userID used as the state 
module.exports.spotifyAuth = async (req, res) => {
    const state = req.query.userId;
    const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';
  
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
      res.redirect(process.env.FRONTEND_URL)

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
        res.status(201).json({message: "Logged into Spotify :)", success: true})
      } else {
        res.status(200).json({message: "You gotta log in to Spotify!"})
      }
    } else {
      res.status(500).json({ message: 'User not Found' });
    }
  } catch(error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
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
        const {newAccessToken, refreshToken, expiresIn} = await refreshSpotifyToken(user.spotifyRefreshToken)
        accessToken = newAccessToken;
        await User.findOneAndUpdate({_id: userId}, {spotifyAccessToken : newAccessToken, spotifyRefreshToken : refreshToken, spotifyTokenExpiresIn : expiresIn});
      } 
      // Now you can use `accessToken` to make authorized requests to Spotify's API
    } else {
      res.status(500).json({ message: 'Failed to fetch access token' });
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
      res.status(201).json({message : userPlaylists, success : true});
    } else {
      res.status(userPlaylistsResponse.status).json({ message: 'Failed to fetch user profile' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
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
        const {newAccessToken, refreshToken, expiresIn} = await refreshSpotifyToken(user.spotifyRefreshToken)
        accessToken = newAccessToken;
        await User.findOneAndUpdate({_id: userId}, {spotifyAccessToken : newAccessToken, spotifyRefreshToken : refreshToken, spotifyTokenExpiresIn : expiresIn});
      } 
      // Now you can use `accessToken` to make authorized requests to Spotify's API
    } else {
      res.status(500).json({ message: 'Failed to fetch access token' });
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
      // Redirect the user to the frontend with user info in query parameters
      res.json({message : userProfile, success : true});
    } else {
      res.status(userProfileResponse.status).json({ message: 'Failed to fetch user profile' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

//Function to fetch songs of the playlist
//Input: playlist ID
//userId to fetch access token
//Output: track name, artist name, album name
module.exports.spotifyPlaylistItems = async(playlistID, userId) => {
  try {
    let accessToken = null;
    const user = await User.findOne({_id: userId}).exec();

    if (user) {
      accessToken = user.spotifyAccessToken;
      if (isAccessTokenExpired(user.spotifyTokenExpiresIn)) {
        const {newAccessToken, refreshToken, expiresIn} = await refreshSpotifyToken(user.spotifyRefreshToken);
        accessToken = newAccessToken;
        await User.findOneAndUpdate({_id: userId}, {spotifyAccessToken : newAccessToken, spotifyRefreshToken : refreshToken, spotifyTokenExpiresIn : expiresIn});
      } 
      // Now you can use `accessToken` to make authorized requests to Spotify's API
    } else {
      return({status: "failed", message: "User not found and failed to fetch access token"});
    }

    // Make an API request to fetch the user's profile information
    const playlistItems = await axios.get(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      params: {
        fields: "items(track(name, album(name), artists(name)))",
        limit: 50,
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (playlistItems.status === 200) {
      return({status: "success", message: playlistItems.data.items})
    } else {
      return({status: "failed", message: "Failed to fetch playlist items"})
    }

  } catch(error) {
    console.error('Error:', error);
    return ({status : "failed", message : "Internal Server Error!"});
  }
}

//Function to fetch songs of the playlist
//Input: playlist ID
//userId to fetch access token
//Output: track name, artist name, album name
module.exports.spotifySeacrhSong = async(songs, userId) => {
  try {
    let songIds = []

    let accessToken = null;
    const user = await User.findOne({_id: userId}).exec();

    if (user) {
      accessToken = user.spotifyAccessToken;
      if (isAccessTokenExpired(user.spotifyTokenExpiresIn)) {
        const {newAccessToken, refreshToken, expiresIn} = await refreshSpotifyToken(user.spotifyRefreshToken)
        accessToken = newAccessToken
        await User.findOneAndUpdate({_id: userId}, {spotifyAccessToken : newAccessToken, spotifyRefreshToken : refreshToken, spotifyTokenExpiresIn : expiresIn});
      } 
      // Now you can use `accessToken` to make authorized requests to Spotify's API
    } else {
      return({status: "failed", message: "User not found and failed to fetch access token"});
    }

    for (const i in songs) {
      const searchQuery = "track%3A" + songs[i].name + "%2520artist%3A" + songs[i].artists[0].name

      // Make an API request to fetch the songId of song
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: searchQuery,
          type: 'track',
          limit: 1,
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (response.status === 200) {
        songIds.push(response.data.tracks.items[0].id)
      } else {
        return({status: "failed", message: "Failed to fetch ID of the song in spotify"})
      }
    }
    return ({status: "success", message: songIds});
  } catch(error) {
    console.error('Error:', error);
    return ({status : "failed", message : "Internal Server Error"});
  }
}

module.exports.spotifyCreatePlaylist = async (songIds, userId, name) => {
  try {
    let accessToken = null;
    let playlistID;
    const user = await User.findOne({_id: userId}).exec();

    if (user) {
      accessToken = user.spotifyAccessToken;
      if (isAccessTokenExpired(user.spotifyTokenExpiresIn)) {
        const {newAccessToken, refreshToken, expiresIn} = await refreshSpotifyToken(user.spotifyRefreshToken)
        accessToken = newAccessToken
        await User.findOneAndUpdate({_id: userId}, {spotifyAccessToken : newAccessToken, spotifyRefreshToken : refreshToken, spotifyTokenExpiresIn : expiresIn});
      } 
      // Now you can use `accessToken` to make authorized requests to Spotify's API
    } else {
      return({status: "failed", message: "User not found and failed to fetch access token"});
    }

    //Make API request to create a playlist 
    const playlistIdResponse = await axios.post('https://api.spotify.com/v1/me/playlists', {name: name}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (playlistIdResponse.status === 201) {
      playlistID = playlistIdResponse.data.id
    } else {
      return({status: "failed", message: "Could not create playlist :("})
    }

    songIds = songIds.map((songId) => "spotify:track:"+songId)

    const songsAddedResponse = await axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {uris: songIds}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (songsAddedResponse.status !== 201) return({status: "failed", message: "Error adding song to playlist"})
    
    return({status : "success", message: "Playlist successfully created!"})

  } catch(error) {
    console.error('Error:', error);
    return ({status : "failed", message : "Internal Server Error!"});
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
async function refreshSpotifyToken(refreshToken) {
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
      return {newAccessToken : tokenResponse.data.access_token, refreshToken : tokenResponse.data.refreshToken, expiresIn : Math.floor(Date.now() / 1000) + tokenResponse.data.expires_in};
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}
