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
  youtubeTokens : {
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

//TODO: Song as model

//TODO: Music App as model

module.exports = mongoose.model("User", userSchema);