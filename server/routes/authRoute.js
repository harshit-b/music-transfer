const { Signup, Login, userVerification } = require("../controllers/autoController");
const { spotifyCallback, spotifyAuth, spotifyUserProfile, spotifyUserPlaylists } = require("../controllers/spotifyController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);
router.get("/spotify/login", spotifyAuth);
router.get("/spotify/callback", spotifyCallback)
router.get("/spotify/userProfile", spotifyUserProfile)
router.get("/spotify/userPlaylists", spotifyUserPlaylists)

module.exports = router;