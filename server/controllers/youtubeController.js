const querystring = require('node:querystring')
const {google} = require('googleapis')

/**
     * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
     * from the client_secret.json file. To get these credentials for your application, visit
     * https://console.cloud.google.com/apis/credentials.
     */
const oauth2Client = new google.auth.OAuth2(
    '627567702093-scp9a3bsjhosfv1cep57oluvdvq4mvjv.apps.googleusercontent.com',
    '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',
    'http://localhost:4000/youtube/callback'
);

// Access scopes for read-only Drive activity.
const scopes = [
    'https://www.googleapis.com/auth/youtube'
];

var youtube = google.youtube('v3');

const User = require("../models/userModel");
const axios = require('axios');

//Initiate OAuth flow - Spotify
//Input in the query - userId: ID of the user in mongoDB database
//userID used as the state 
module.exports.youtubeAuth = async (req, res) => {
  
    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
         * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        state: req.query.userId,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true
    });

    res.redirect(authorizationUrl);
}

//Callback function getting response from spotify login API
//Response: code, state(userID) if accepted 
module.exports.youtubeCallback = async (req, res) => {
    try {
        var code = req.query.code || null;
        var userId = req.query.state || null;
        // Exchange the authorization code for an access token and refresh token
        let { tokens } = await oauth2Client.getToken(code);
  
      if (tokens) {
        const filter = {_id : userId}
        const update = {youtubeTokens : tokens, youtubeLoggedIn : true }
        //Store Access Token and Refresh Token of user in database
        await User.findOneAndUpdate(filter, update);
        res.redirect(`http://localhost:3000/`)
  
      } else {
        res.status(tokenResponse.status).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.youtubePlaylists = async (req, res) => {
    try {
        const userId = req.query.userId;
        let tokens = null;
        const user = await User.findOne({_id: userId}).exec();

        if (user) {
            tokens = user.youtubeTokens
            oauth2Client.setCredentials(tokens)

            youtube.playlists.list({
                auth: oauth2Client,
                part: ["snippet"],
                mine: true
            }, (error, response) => {
                const playlists = response.data.items
                if (error) res.status(500).json({error})
                res.json({playlists})
            })
        } else {
            res.status(500).json({ error: 'Failed to fetch access token' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Function to check if user has already logged in to spotify or not 
//Input in query - userID
//userID to fetch accessToken
module.exports.checkIfLoggedInToYoutube = async(req, res) => {
    try{
      const userId = req.query.userId;
      const user = await User.findOne({_id: userId}).exec();
      
      if (user) {
        if (user.youtubeTokens) {
          res.json({userLoggedIntoYoutube: true})
        } else {
          res.json({userLoggedIntoYoutube: false})
        }
      } else {
        res.status(500).json({ error: 'User not Found' });
      }
    } catch(error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }