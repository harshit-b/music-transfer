const {google} = require('googleapis')
const YTMusic = require("ytmusic-api").default

/**
     * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
     * from the client_secret.json file. To get these credentials for your application, visit
     * https://console.cloud.google.com/apis/credentials.
     */
const oauth2Client = new google.auth.OAuth2(
    '627567702093-scp9a3bsjhosfv1cep57oluvdvq4mvjv.apps.googleusercontent.com',
    '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',
    `${process.env.BACKEND_URL}/youtube/callback`
);

// Access scopes for read-only Drive activity.
const scopes = [
    'https://www.googleapis.com/auth/youtube'
];

var youtube = google.youtube('v3');

const User = require("../models/userModel");

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
        res.redirect(process.env.FRONTEND_URL)
  
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
                mine: true,
                maxResults: 50,
            }, (error, response) => {
                const playlists = response.data.items
                if (error) res.status(500).json({message:error})
                res.status(201).json({message:playlists, success: true})
            })

        } else {
            res.status(500).json({ message:'Failed to fetch access token'});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message:'Internal server error' });
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
          res.status(200).json({message: "Logged into Youtube!", success : true})
        } else {
          res.status(200).json({message: "Gotta login to youtube :)"})
        }
      } else {
        res.status(500).json({ message: 'User not Found' });
      }
    } catch(error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //Fetch item IDs of items in playlist
  //Input: Playlist ID
  //Output: itemIDs of items in that playlist
  module.exports.youtubePlaylistItemIDs = async (playlist, userId) => {
    try {
      console.log("Retrieving Playlist Info: ...", playlist);
        // getting playlist details!
        // playlistIDs.map((playlistID) => {
        // })
        let tokens = null;
        const user = await User.findOne({_id: userId}).exec();

        if (user) {
          tokens = user.youtubeTokens
          oauth2Client.setCredentials(tokens)

          const response = await youtube.playlistItems.list({
            auth: oauth2Client,
            part: ["contentDetails"],
            playlistId: playlist,
            maxResults: 50,
          })

          if (response.status === 200) {
            const playlistItemIDs = response.data.items.map((item) => item.contentDetails.videoId)
            return ({status: "success", message : playlistItemIDs})
          } else {
            return ({status : "failed", messsage : "Could not fetch playlist list"})
          }
          
        } else {
          return ({status : "failed", messsage : "User not found and failed to fetch access token"})
        }

    } catch(error) {
      console.error('Error:', error);
      return ({status : "failed", message : "Internal Server Error!"});
    }
  }

  //Get songs from the playlist
  //Input: IDS of songs in the playlist
  //Output: name, artist of the songs in the playlist
  module.exports.youtubeSongs = async(playlistItemIDs) => {
    try {
      let songs = []
      const ytmusic = await new YTMusic().initialize()
      for (const i in playlistItemIDs) {
        const song = await ytmusic.getSong(playlistItemIDs[i])
        songs.push({name : song.name, artists: song.artists})
      }
      return ({status : "success", message : songs})
    } catch(error) {
      console.error('Error:', error);
      return ({status : "failed", message : "Internal Server Error!"});
    }
  }

  //Searches for songs in youtube and returns IDs so that the songs can be added to the playlist
  //Input: songs (format: spotify)
  //Output: list of videoIDs
  module.exports.youtubeSearchSongs = async(songs) => {
    const ytmusic = await new YTMusic().initialize();
    let songIds = []

    for (const i in songs) {
      const search_query = songs[i].track.name + " " + songs[i].track.album.name + " " + songs[i].track.artists[0].name;
      const songSearchResult = await ytmusic.searchSongs(search_query);
      songIds.push(songSearchResult[0].videoId)
    }
    return songIds;
  }

  //Creates playlist in youtube
  //Input: IDs of songs to be added in playlist
  //Output: Playlist is created 
  module.exports.youtubeCreatePlaylist = async(songIds, userId, name) => {
      try {
        console.log("Creating playlist...");
        let tokens = null;
        const user = await User.findOne({_id: userId}).exec();

        if (user) {
          tokens = user.youtubeTokens
          oauth2Client.setCredentials(tokens)

          const response = await youtube.playlists.insert({
            auth: oauth2Client,
            part: ["snippet", "id"],
            requestBody: {
              "snippet": {
                "title": name
              }
            }
          })

          if (response.status !== 200) return ({status: "failed", message: "Could not create playlist"})
          playlistID = response.data.id
          for (const i in songIds) {
            console.log("adding song", songIds[i])
            const response = await youtube.playlistItems.insert({
              auth: oauth2Client,
              part: ["snippet"],
              requestBody: {
                "snippet": {
                  "playlistId": playlistID,
                  "resourceId": {
                    "kind" : "youtube#video",
                    "videoId": songIds[i]
                  }
                }
              }
            })

            if (response.status !== 200) return({status: "failed", message: "Error adding song to playlist"})
          }

          return({status: "success", message: "Playlist successfully created!"})

        } else {
          return ({status : "failed", messsage: "User not found and failed to fetch access token"})
        }
      } catch(error) {
        console.error('Error:', error);
        return ({status : "failed", message : "Internal Server Error!"});
      }
  }

  // getting playlist details!
  // youtube.playlistItems.list({
  //   auth: oauth2Client,
  //   part: ["snippet"],
  //   playlistId: playlist.id,
  //   maxResults: 50,
  // }, (error, response) => {
  //   const playlistItems = response.data.items
  //   if (error) res.status(500).json({error})
  // })