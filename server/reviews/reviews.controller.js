const express = require('express');
const router = express.Router();
const db = require('../db');

// routes
router.post('/getTrackReviews', getTrackReviews);

module.exports = router;

// functions
async function getTrackReviews(req, res, next) {
    let spotifyID = req.body.path;
    const qResult = await db.pool.query(`SELECT * FROM tracks WHERE spotifyid = $1`, [spotifyID])
    if (!qResult.rows[0]) {
        res.json({ likes: 0, rating: 0, ratings: 0, reviews: 0 })
    } else {
        const reviews = qResult.rows[0]
        console.log('reviews: '+JSON.stringify(reviews));
        res.json({ reviewed: false })
    }
}