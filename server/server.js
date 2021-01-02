const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error-handler');
const { pool } = require('./db');
var SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// API ROUTES
app.use('/users', require('./users/user.controller'));
app.use('/spotify', require('./spotify/spotify.controller'));
app.use('/track', require('./spotify/spotify.controller'));
app.use('/reviews', require('./reviews/reviews.controller'));

// global error handler
app.use(errorHandler);

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});