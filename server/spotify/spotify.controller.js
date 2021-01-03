var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const router = express.Router();
require('dotenv').config();

const token = "BQDeD_ZKsSCiMuU3QuTsIxeasCmONYSyu0NnEMzp3nzcXTxGtBYwnXdZypa1yia7DyDe0Tn6UXtoGc95lEw";
var spotifyApi = new SpotifyWebApi({
    clientId: 'f815b759da33469fb665036ebd617995',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'localhost:4000/callback'
});

function newToken() {
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
          console.log('Something went wrong when retrieving an access token', err);
        }
    );
}

newToken();
tokenRefreshInterval = setInterval(newToken, 1000 * 60 * 60); //Refresh access token every 60 minutes 


// routes
router.post('/getTrack', getTrack);
router.post('/getAlbum', getAlbum);
router.get('/getUSTop50', getUSTop50);
router.get('/getNewReleases', getNewReleases);

module.exports = router;

// functions
async function getTrack(req, res, next) {
    console.log('getTrack called req.body: '+req.body.path)
    spotifyApi.getTrack(req.body.path)
    .then(function(data) {
      // console.log('Some information about this song', data.body);
      res.send({ data: data.body })
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getAlbum(req, res, next) {
  console.log('getTrack called req.body: '+req.body.path)
  spotifyApi.getAlbum(req.body.path)
  .then(function(data) {
    // console.log('Some information about this song', data.body);
    res.send({ data: data.body })
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getUSTop50(req, res, next) {
    console.log('server getTop50 called')
    spotifyApi.getPlaylist('16wsvPYpJg1dmLhz0XTOmX')
    .then(function(data) {
      // console.log('Some information about this playlist', data.body);
      res.send({ data: data.body })
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getNewReleases(req, res, next) {
  console.log('server getNewReleases called')
  spotifyApi.getNewReleases({ limit : 48, offset: 0, country: 'US' })
  .then(function(data) {
    // console.log('Some information about this playlist', data.body);
    res.send({ data: data.body })
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}