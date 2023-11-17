//All the routes to backend
const { Signup, Login, userVerification, transferPlaylist } = require("../controllers/authController");
const { spotifyCallback, spotifyAuth, spotifyUserProfile, spotifyUserPlaylists, checkIfLoggedInToSpotify } = require("../controllers/spotifyController");
const { youtubeAuth, youtubeCallback, youtubePlaylists, checkIfLoggedInToYoutube, retrievePlaylistData } = require("../controllers/youtubeController");
const router = require("express").Router();

//Authentication and user-verification routes
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);

//Routes to handle spotify APIs
router.get("/spotify/login", spotifyAuth);
router.get("/spotify/callback", spotifyCallback);
router.get("/spotify/userProfile", spotifyUserProfile);
router.get("/spotify/userPlaylists", spotifyUserPlaylists);
router.get("/spotify/userLoggedIntoSpotify", checkIfLoggedInToSpotify);

//Routes to handle youtube APIs
router.get("/youtube/login", youtubeAuth);
router.get("/youtube/callback", youtubeCallback);
router.get("/youtube/playlists", youtubePlaylists)
router.get("/youtube/userLoggedIntoYoutube", checkIfLoggedInToYoutube);

//Backend Calls!
router.post("/transferPlaylist", transferPlaylist);

module.exports = router;