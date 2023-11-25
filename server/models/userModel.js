//All classes as MongoDB models in database

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//User class as model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  spotifyAccessToken: {
    type: String
  },
  spotifyRefreshToken: {
    type: String
  },
  spotifyTokenExpiresIn: {
    type: Number
  },
  spotifyLoggedIn: {
    type: Boolean,
  },
  youtubeTokens: {
    type: Object
  },
  youtubeLoggedIn: {
    type: Boolean
  },
  youtubePlaylistIDs: {
    type: Array
  },
  spotifyPlaylistIDs: {
    type: Array
  },
  playlistsTransferred: {
    type: Array
  }

});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

//TODO: Playlist as model
const playlistSchema = new mongoose.Schema({
  playName: {
    type: String,
    required: [true],
    default: 'MyPlaylist' //Replace with user input if we want to
  },
  owner: { //References user model
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  songs: {
    type: [String],
    required: [true], //Playlist can't exist without a song
    unique: true, //No two videos/songs are the same title, right?
  }

});

//TODO: Song as model
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true],
  },
  artist: {
    type: String,
    required: true,
  },
  releaseDate: Date, // Some videos/songs may not have this detail, it's your call
  genre: String,
  durationInSeconds: {
    type: Number,
    required: true,
    min: 0,
  },
  playlist: { // 
    type: Schema.Types.ObjectId,
    ref: "Playlist"
  }
});

//TODO: Music App as model
const musicAppSchema = new mongoose.Schema({
  service: {
    type: String,
    required: [true],
  },
  accessToken: Object,
  refreshtoken: Object,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

//Giving each schema to a variable for later use
const User = mongoose.model("User", userSchema);
const Playlist = mongoose.model("Playlist", playlistSchema);
const Song = mongoose.model("Song", songSchema);
const MusicApp = mongoose.model("MusicApp", musicAppSchema);

//Exporting all the models for usage
module.exports = {
  User, Playlist, Song, MusicApp
};
