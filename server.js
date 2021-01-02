// This file is for deployments
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/dist/my-song-list'));

app.listen(process.env.PORT || 8080);

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/my-song-list/index.html'));
});

console.log('Console listening!');