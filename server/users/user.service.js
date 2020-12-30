const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

module.exports = {
    authenticate,
    getAll,
    getById,
    register,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await db.users.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { user, token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function register(params) {
    console.log('PARAMS: '+JSON.stringify(params));

    // Check if username already exists
    db.pool.query(
        `SELECT * FROM users
            WHERE username = $1`,
        [params.username],
        (err, results) => {
            if (err) {
            console.log(err);
            }
            console.log('found dupes: '+JSON.stringify(results.rows));
    
            if (results.rows.length > 0) {
                this.test = true;
            }
        }
    );

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    db.pool.query(
        `SELECT * FROM users
            WHERE email = $1`,
        [params.email],
        (err, results) => {
            if (err) {
            console.log(err);
            }
            console.log(results.rows);
    
            if (results.rows.length > 0) {
            return "Email already registered";
            } else {
            db.pool.query(
                `INSERT INTO users (username, email, password)
                    VALUES ($1, $2, $3)
                    RETURNING id, password`,
                [params.username, params.email, params.hash],
                (err, results) => {
                if (err) {
                    throw err;
                }
                console.log("Registration successful");
                console.log(results.rows);
                }
            );
            }
        }
    );

    console.log({
        email,
        username,
        password
    });
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}