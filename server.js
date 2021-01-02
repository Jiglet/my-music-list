// This file is for deployments
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/dist/my-song-list'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/my-song-list/index.html'));
});

const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./server/middleware/error-handler');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// API ROUTES
app.use('/users', require('./server/users/user.controller'));
app.use('/spotify', require('./server/spotify/spotify.controller'));
app.use('/track', require('./server/spotify/spotify.controller'));
app.use('/reviews', require('./server/reviews/reviews.controller'));

// global error handler
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});