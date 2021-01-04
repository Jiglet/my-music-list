const express = require('express');
const router = express.Router();
const db = require('../db');

// routes
router.post('/getTrackReviews', getTrackReviews);
router.post('/submitReview', submitReview);
router.post('/submitRating', submitRating);
router.post('/editRating', editRating);
router.post('/getUserSongData', getUserSongData);

router.post('/getAlbumReviews', getAlbumReviews);
router.post('/submitAlbumReview', submitAlbumReview);
router.post('/submitAlbumRating', submitAlbumRating);
router.post('/editAlbumRating', editAlbumRating);
router.post('/getUserAlbumData', getUserAlbumData);

module.exports = router;

// user inputs
// -------------------------------------------SONG RATINGS/REVIEWS-------------------------------------------
async function getTrackReviews(req, res, next) {
    try {
        let spotifyID = req.body.id;
        // console.log('spotifyID: '+spotifyID)
        const qResult = await db.pool.query(`SELECT * FROM tracks WHERE spotifyid = $1`, [spotifyID])
        if (!qResult.rows[0]) { // If track doesn't exist on db, it has no ratings/reviews
            res.json({ likes: 0, rating: 0, ratings: 0, reviews: 0 })
            
        } else {
            const userReviews = await db.pool.query(`SELECT * FROM songreviews WHERE spotifyid = $1 AND review IS NOT NULL`, [spotifyID])
            const numbers = qResult.rows[0]
    
            if (userReviews.rows[0]) {
                console.log('USERREVIEWS: '+JSON.stringify(userReviews.rows))
                res.json({ likes: numbers['likes'], rating: numbers['rating'], ratings: numbers['ratings'], reviews: numbers['reviews'], userReviews: userReviews.rows })
            } else{
                res.json({ likes: numbers['likes'], rating: numbers['rating'], ratings: numbers['ratings'], reviews: numbers['reviews'] })
            }
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function getUserSongData(req, res, next) {
    try {
        let { userID, spotifyID }= req.body;
        console.log('userID: '+userID)
        console.log('spotifyID: '+spotifyID)
       const qResult = await db.pool.query(`SELECT * FROM songreviews WHERE spotifyid = $1 AND userid = $2`, [spotifyID, userID])
       if (!qResult.rows[0]) {
           console.log("USER HAS NOT RATED")
           res.json({ rated: false })
       } else {
           const userRatings = qResult.rows[0]
           console.log('userRatings: '+JSON.stringify(userRatings));
           res.json({ rated: true, rating: userRatings['rating'], review: userRatings['review'], date: userRatings['date'] })
       }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function submitRating(req, res, next) {
    try {
        console.log('req.body: '+JSON.stringify(req.body));
        let { userID, username, spotifyID, rating } = req.body;
        let date = new Date().toLocaleDateString();
    
        console.log(userID, username, spotifyID, rating)
        // Check if user has existing review
        const exists = await db.pool.query(`SELECT * FROM songreviews WHERE userid = $1 AND spotifyid = $2`, [userID, spotifyID])
        if (exists.rows[0]) { // User already has existing review
            console.log("User already submitted rating");
            res.json({ success: false });
        }
        else {
            await db.pool.query(`INSERT INTO songreviews (userid, username, rating, spotifyid, date) VALUES ($1, $2, $3, $4, $5)`, [userID, username, rating, spotifyID, date])
    
            const ratings = await db.pool.query(`SELECT ratings, totalrating FROM tracks WHERE spotifyid = $1`, [spotifyID])
            if (ratings.rows[0]) { // If track already exists in tracks
                console.log('ratings.rows[0]: '+JSON.stringify(ratings.rows[0]))
                newRatings = ratings.rows[0].ratings + 1
                newTotalRatings = ratings.rows[0].totalrating + rating
                await db.pool.query(`UPDATE tracks SET ratings = ratings + 1, totalrating = totalrating + $1 WHERE spotifyid = $2`, [rating, spotifyID])
                await db.pool.query(`UPDATE tracks SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])
                
            } else {
                await db.pool.query(`INSERT INTO tracks (spotifyid, rating, reviews, likes, ratings, totalrating) VALUES ($1, $2, $3, $4, $5, $6)`, [spotifyID, rating, 0, 0, 1, rating])
                console.log('ratings.rows[0]: '+ratings.rows[0])
            }
            
            // await db.pool.query(`UPDATE tracks SET totalrating = SUM(totalrating) + SUM($1) WHERE spotifyid = $2`, [rating, spotifyID])
            // await db.pool.query(`UPDATE tracks SET rating = totalrating/ratings`)
    
            res.json({ success: true });
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function editRating(req, res, next) {
    try {
        console.log('req.body: '+JSON.stringify(req.body));
        let { userID, username, spotifyID, rating } = req.body;
        let date = new Date().toLocaleDateString();
    
        console.log(userID, username, spotifyID, rating)
        // Check if user has existing review
        const exists = await db.pool.query(`SELECT * FROM songreviews WHERE userid = $1 AND spotifyid = $2`, [userID, spotifyID])
        if (exists.rows[0]) { // User already has existing review
            //Find out how much to change totalrating
            let diff = rating - exists.rows[0]['rating'] 
            await db.pool.query(`UPDATE songreviews SET rating = $1, date = $2 WHERE userid = $3 AND spotifyid = $4`, [rating, date, userID, spotifyID])
            await db.pool.query(`UPDATE tracks SET totalrating = totalrating + $1 WHERE spotifyid = $2`, [diff, spotifyID])
            await db.pool.query(`UPDATE tracks SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])
            res.json({ success: true });
        }
        else {
            res.json({ success: false });
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function submitReview(req, res, next) { // TODO
    try {
        console.log('req.body: '+JSON.stringify(req.body));
        let { userID, username, spotifyID, rating, reviewContent } = req.body
        let date = new Date().toLocaleDateString();
    
        const exists = await db.pool.query(`SELECT * FROM songreviews WHERE userid = $1 AND spotifyid = $2`, [userID, spotifyID])
        if (exists.rows[0]) { // User already has existing review. Therefore, track is already in tracks table as well so we update that row
            //Find out how much to change totalrating
            let diff = rating - exists.rows[0]['rating'] 
            await db.pool.query(`UPDATE songreviews SET rating = $1, review = $2 WHERE userid = $3 AND spotifyid = $4`, [rating, reviewContent, userID, spotifyID])
            await db.pool.query(`UPDATE tracks SET totalrating = totalrating + $1 WHERE spotifyid = $2`, [diff, spotifyID])
            await db.pool.query(`UPDATE tracks SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])

            // Check if we need to increment review number
            if (!exists.rows[0]['review']) {
                await db.pool.query(`UPDATE tracks SET reviews = reviews + 1 WHERE spotifyid = $1`, [spotifyID])
            }
            res.json({ success: true });
        }
        else { // User does not have existing review
            //Insert review into songreviews table
            await db.pool.query(`INSERT INTO songreviews (userid, username, rating, spotifyid, date, review) VALUES ($1, $2, $3, $4, $5, $6)`, [userID, username, rating, spotifyID, date, reviewContent])
    
            // Check if track exists in tracks table
            const ratings = await db.pool.query(`SELECT ratings, totalrating FROM tracks WHERE spotifyid = $1`, [spotifyID])
            if (ratings.rows[0]) { // If track already exists in tracks
                console.log('ratings.rows[0]: '+JSON.stringify(ratings.rows[0]))
                newRatings = ratings.rows[0].ratings + 1
                newTotalRatings = ratings.rows[0].totalrating + rating
                await db.pool.query(`UPDATE tracks SET ratings = ratings + 1, totalrating = totalrating + $1 WHERE spotifyid = $2`, [rating, spotifyID])
                await db.pool.query(`UPDATE tracks SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])
                await db.pool.query(`UPDATE tracks SET reviews = reviews + 1 WHERE spotifyid = $1`, [spotifyID])
            } 
            else {
                await db.pool.query(`INSERT INTO tracks (spotifyid, rating, reviews, likes, ratings, totalrating) VALUES ($1, $2, $3, $4, $5, $6)`, [spotifyID, rating, 1, 0, 1, rating])
                console.log('ratings.rows[0]: '+ratings.rows[0])
            }
            res.json({ success: true });
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

// -------------------------------------------ALBUM RATINGS/REVIEWS-------------------------------------------
async function getAlbumReviews(req, res, next) {
    try {
        let spotifyID = req.body.id;
        // console.log('spotifyID: '+spotifyID)
        const qResult = await db.pool.query(`SELECT * FROM albums WHERE spotifyid = $1`, [spotifyID])
        if (!qResult.rows[0]) { // If track doesn't exist on db, it has no ratings/reviews
            res.json({ likes: 0, rating: 0, ratings: 0, reviews: 0 })
            
        } else {
            const userReviews = await db.pool.query(`SELECT * FROM albumreviews WHERE spotifyid = $1 AND review IS NOT NULL`, [spotifyID])
            const numbers = qResult.rows[0]
    
            if (userReviews.rows[0]) {
                console.log('USERREVIEWS: '+JSON.stringify(userReviews.rows))
                res.json({ likes: numbers['likes'], rating: numbers['rating'], ratings: numbers['ratings'], reviews: numbers['reviews'], userReviews: userReviews.rows })
            } else{
                res.json({ likes: numbers['likes'], rating: numbers['rating'], ratings: numbers['ratings'], reviews: numbers['reviews'] })
            }
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function submitAlbumRating(req, res, next) {
    try {
        console.log('req.body: '+JSON.stringify(req.body));
        let { userID, username, spotifyID, rating } = req.body;
        let date = new Date().toLocaleDateString();
    
        console.log(userID, username, spotifyID, rating)
        // Check if user has existing review
        const exists = await db.pool.query(`SELECT * FROM albumreviews WHERE userid = $1 AND spotifyid = $2`, [userID, spotifyID])
        if (exists.rows[0]) { // User already has existing review
            console.log("User already submitted rating");
            res.json({ success: false });
        }
        else {
            await db.pool.query(`INSERT INTO albumreviews (userid, username, rating, spotifyid, date) VALUES ($1, $2, $3, $4, $5)`, [userID, username, rating, spotifyID, date])
    
            const ratings = await db.pool.query(`SELECT ratings, totalrating FROM albums WHERE spotifyid = $1`, [spotifyID])
            if (ratings.rows[0]) { // If track already exists in tracks
                console.log('ratings.rows[0]: '+JSON.stringify(ratings.rows[0]))
                newRatings = ratings.rows[0].ratings + 1
                newTotalRatings = ratings.rows[0].totalrating + rating
                await db.pool.query(`UPDATE albums SET ratings = ratings + 1, totalrating = totalrating + $1 WHERE spotifyid = $2`, [rating, spotifyID])
                await db.pool.query(`UPDATE albums SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])
                
            } else {
                await db.pool.query(`INSERT INTO albums (spotifyid, rating, reviews, likes, ratings, totalrating) VALUES ($1, $2, $3, $4, $5, $6)`, [spotifyID, rating, 0, 0, 1, rating])
                console.log('ratings.rows[0]: '+ratings.rows[0])
            }
    
            res.json({ success: true });
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function editAlbumRating(req, res, next) {
    try {
        console.log('req.body: '+JSON.stringify(req.body));
        let { userID, username, spotifyID, rating } = req.body;
        let date = new Date().toLocaleDateString();
    
        console.log(userID, username, spotifyID, rating)
        // Check if user has existing review
        const exists = await db.pool.query(`SELECT * FROM albumreviews WHERE userid = $1 AND spotifyid = $2`, [userID, spotifyID])
        if (exists.rows[0]) { // User already has existing review
            //Find out how much to change totalrating
            let diff = rating - exists.rows[0]['rating'] 
            await db.pool.query(`UPDATE albumreviews SET rating = $1, date = $2 WHERE userid = $3 AND spotifyid = $4`, [rating, date, userID, spotifyID])
            await db.pool.query(`UPDATE albums SET totalrating = totalrating + $1 WHERE spotifyid = $2`, [diff, spotifyID])
            await db.pool.query(`UPDATE albums SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])
            res.json({ success: true });
        }
        else {
            res.json({ success: false });
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function submitAlbumReview(req, res, next) { // TODO
    try {
        console.log('req.body: '+JSON.stringify(req.body));
        let { userID, username, spotifyID, rating, reviewContent } = req.body
        let date = new Date().toLocaleDateString();
    
        const exists = await db.pool.query(`SELECT * FROM albumreviews WHERE userid = $1 AND spotifyid = $2`, [userID, spotifyID])
        if (exists.rows[0]) { // User already has existing review. Therefore, track is already in albums table as well so we update that row
            //Find out how much to change totalrating
            let diff = rating - exists.rows[0]['rating'] 
            await db.pool.query(`UPDATE albumreviews SET rating = $1, review = $2 WHERE userid = $3 AND spotifyid = $4`, [rating, reviewContent, userID, spotifyID])
            await db.pool.query(`UPDATE albums SET totalrating = totalrating + $1 WHERE spotifyid = $2`, [diff, spotifyID])
            await db.pool.query(`UPDATE albums SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])

            // Check if we need to increment review number
            if (!exists.rows[0]['review']) {
                await db.pool.query(`UPDATE albums SET reviews = reviews + 1 WHERE spotifyid = $1`, [spotifyID])
            }
            res.json({ success: true });
        }
        else { // User does not have existing review
            //Insert review into songreviews table
            await db.pool.query(`INSERT INTO albumreviews (userid, username, rating, spotifyid, date, review) VALUES ($1, $2, $3, $4, $5, $6)`, [userID, username, rating, spotifyID, date, reviewContent])
    
            // Check if track exists in albums table
            const ratings = await db.pool.query(`SELECT ratings, totalrating FROM albums WHERE spotifyid = $1`, [spotifyID])
            if (ratings.rows[0]) { // If track already exists in albums
                console.log('ratings.rows[0]: '+JSON.stringify(ratings.rows[0]))
                newRatings = ratings.rows[0].ratings + 1
                newTotalRatings = ratings.rows[0].totalrating + rating
                await db.pool.query(`UPDATE albums SET ratings = ratings + 1, totalrating = totalrating + $1 WHERE spotifyid = $2`, [rating, spotifyID])
                await db.pool.query(`UPDATE albums SET rating = totalrating/ratings WHERE spotifyid = $1`, [spotifyID])
                await db.pool.query(`UPDATE albums SET reviews = reviews + 1 WHERE spotifyid = $1`, [spotifyID])
            } 
            else {
                await db.pool.query(`INSERT INTO albums (spotifyid, rating, reviews, likes, ratings, totalrating) VALUES ($1, $2, $3, $4, $5, $6)`, [spotifyID, rating, 1, 0, 1, rating])
                console.log('ratings.rows[0]: '+ratings.rows[0])
            }
            res.json({ success: true });
        }
    }
    catch(e) {
        console.log('error: '+e);
    }
}

async function getUserAlbumData(req, res, next) {
    try {
        let { userID, spotifyID }= req.body;
        console.log('userID: '+userID)
        console.log('spotifyID: '+spotifyID)
       const qResult = await db.pool.query(`SELECT * FROM albumReviews WHERE spotifyid = $1 AND userid = $2`, [spotifyID, userID])
       if (!qResult.rows[0]) {
           console.log("USER HAS NOT RATED")
           res.json({ rated: false })
       } else {
           const userRatings = qResult.rows[0]
           console.log('userRatings: '+JSON.stringify(userRatings));
           res.json({ rated: true, rating: userRatings['rating'], review: userRatings['review'], date: userRatings['date'] })
       }
    }
    catch(e) {
        console.log('error: '+e);
    }
}