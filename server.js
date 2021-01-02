// This file is for deployments
const express = require('express');
const app = express();
app.use(express.static('./dist/my-song-list'));
app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: './dist/my-song-list'}
  );
});

app.listen(process.env.PORT || 8080);