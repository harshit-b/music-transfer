//All the routes to backend

const { Signup, Login, userVerification } = require("../controllers/authController");
const { spotifyCallback, spotifyAuth, spotifyUserProfile, spotifyUserPlaylists, checkIfLoggedInToSpotify } = require("../controllers/spotifyController");
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

module.exports = router;