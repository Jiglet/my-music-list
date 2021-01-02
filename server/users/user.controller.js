const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize')
const { response } = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

async function authenticate(req, res, next) {
    let { username, password } = req.body;
    console.log('user pass: '+username+''+password)

    const qResult = await db.pool.query(`SELECT * FROM users WHERE username = $1`, [username])
    if (qResult.rows[0]) {
        const user = qResult.rows[0]
        if (await bcrypt.compare(password, user['password'])) {
            console.log('password: '+password)
            console.log('user password: '+user['password'])
            console.log('password matches')
            res.json({ message: "Login successful", login: true, user: user })
        }
        else {
            console.log('password wrong')
            res.json({ message: "Password is incorrect", login: false })
        }
    } else {
        res.json({ message: "User does not exist", login: false })
    }
}

async function register(req, res) {
    // console.log('PARAMS: '+JSON.stringify(req.body));
    let { email, username, password } = await req.body

    // hash password
    let hash = await bcrypt.hash(password, 10);

    db.pool.query(
        `SELECT * FROM users WHERE email = $1`, [email],
        (err, results) => {
            if (err) {
                console.log(err);
            }
            if (results.rows.length > 0) {
                console.log("E-mail has already been registered")
                res.json({ message: "E-mail has already been registered", registered: false});
            } else {
                db.pool.query(
                    `SELECT * FROM users WHERE username = $1`, [username],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                
                        if (results.rows.length > 0) {
                            console.log("Username has already been taken")
                            res.json({ message: "Username has already been taken", registered: false});
                        } else {
                            db.pool.query(
                                `INSERT INTO users (username, email, password)
                                    VALUES ($1, $2, $3)
                                    RETURNING id, password`,
                                [username, email, hash],
                                (err, results) => {
                                if (err) {
                                    throw err;
                                }

                                console.log("Registration successful");
                                res.json({ message: "Registration successful", registered: true});
                                }
                            );
                        }
                    }
                );
            }
        }
    );
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}