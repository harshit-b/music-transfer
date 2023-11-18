const User = require("../models/userModel");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { youtubePlaylistItemIDs: youtubePlaylistData, youtubeSongs, youtubeSearchSongs, youtubeCreatePlaylist } = require("./youtubeController");
const { spotifyPlaylistItems, spotifySeacrhSong, spotifyCreatePlaylist } = require("./spotifyController");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password' }) 
    } 
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      // domain : process.env.DOMAIN,
      withCredentials: true,
      httpOnly: false,
      // sameSite: 'None',
      // secure: true,
    });
    res.status(201).json({ message: "User logged in successfully", success: true });
    next()
  } catch (error) {
    console.error(error);
  }
}

module.exports.ClearCookie = (req, res) => {
  console.log("cookie")
  res.clearCookie("token", {withCredentials: true,
    httpOnly: false,
    // sameSite: 'None',
    // secure: true,}
});
  res.send('Cookie Cleared Successfully')
}

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username, userId:user._id })
      else return res.json({ status: false })
    }
  })
}

module.exports.transferPlaylist = async (req, res) => {
  try {
    let songs = [];
    let songIds = [];
    console.log("Transfering Playlist Started: ...")
    const { playlist, sourceApp, destinationApp, userId, name } = req.body;

    const user = await User.findOne({_id: userId}).exec();

    // if (user.playlistsTransferred.includes(playlist)) {
    //   res.status(201).json({message: (name + "Playlist already transferred!"), success: true})
    //   return 
    // }

    let status, message;

    //Retrieving Data from source app according to what is needed in destination app to search song and create playlist
    switch (sourceApp) {
      case "Youtube":
        console.log(sourceApp, " --> ", destinationApp);

        //Retrieving IDs of videos in youtube, the list is called playlistItemsIDs
        ({status, message} = await youtubePlaylistData(playlist, userId));
        if (status !== "success") res.status(500).json({message: message});
        const playlistItemIDs = message;

        //Retrieving song name and artist 
        ({status, message} = await youtubeSongs(playlistItemIDs));
        if (status !== "success") res.status(500).json({message: message});
        songs = message;
        
        //Fetch video metadata which would be needed to find song in spotify
        // ytmusic.getSong(playlistItemIDs[0]).then(song => console.log(song))
        break;

      case "Spotify":
        console.log(destinationApp, "-->", sourceApp);

        ({status, message} = await spotifyPlaylistItems(playlist, userId));
        if (status !== "success") res.status(500).json({message: message});
        songs = message
    }

    switch (destinationApp) {
      case "Youtube":
        console.log("User selected ", destinationApp, "as the destination app");
        songIds = await youtubeSearchSongs(songs);

        ({status, message} = await youtubeCreatePlaylist(songIds, userId, name))
        if (status !== "success") res.status(500).json({message: message});

        break;
      
      case "Spotify":
        //TODO: Search Songs, create playlist in spotify
        console.log("User selected ", destinationApp, "as the destination app");
        ({status, message} = await spotifySeacrhSong(songs, userId));
        if (status !== "success") res.status(500).json({message: message});
        songIds = message;
        console.log(songIds);
        
        ({status, message} = await spotifyCreatePlaylist(songIds, userId, name));
        if (status !== "success") res.status(500).json({message: message});
    }

    // const filter = {_id : userId}
    // // const playlistsTransferred = user.playlistsTransferred.filter((item) => { item!= playlist })
    // const newPlaylistsTransferred = {playlistsTransferred : [...user.playlistsTransferred, playlist]}
    // // await User.findOneAndUpdate(filter, playlistsTransferred)
    // await User.findOneAndUpdate(filter, newPlaylistsTransferred)
    res
      .status(201)
      .json({message: ("Transfer Completed for" + name + "! "), success: true});
  } catch(error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}