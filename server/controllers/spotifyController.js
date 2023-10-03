const querystring = require('node:querystring')
const axios = require('axios');
const client_id = "06d6e4c4bfd34e0ba2d776f2f18ffb09"
const redirect_uri = "http://localhost:4000/spotify/callback"
const client_secret = "b513d75dc33f4f78be7dbbfa852b13dc"

module.exports.spotifyAuth = async (req, res) => {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope, 
        redirect_uri: redirect_uri,
        state: state
      }));
}

module.exports.spotifyCallback = async (req, res) => {
  try {
    var code = req.query.code || null;
    var state = req.query.state || null;

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
      const access_token = tokenResponse.data.access_token;

      // Make an API request to fetch the user's profile information
      const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (userProfileResponse.status === 200) {
        // Extract user profile information
        const userProfile = userProfileResponse.data;


        // Construct a redirect URL to the frontend, including user info in query parameters
        const redirectUrl = `http://localhost:3000/spotify/userprofile?name=${userProfile.display_name}&email=${userProfile.email}`;

        // Redirect the user to the frontend with user info in query parameters
        res.redirect(redirectUrl);
      } else {
        res.status(userProfileResponse.status).json({ error: 'Failed to fetch user profile' });
      }
    } else {
      res.status(tokenResponse.status).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to generate a random string for the state parameter
function generateRandomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}
