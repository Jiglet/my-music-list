const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error-handler');
const { pool } = require('./db');

const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello");
});

// API ROUTES

// users
app.use('/users', require('./users/user.controller'));

// global error handler
app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});