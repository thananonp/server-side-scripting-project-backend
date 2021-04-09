'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');

const login = (req, res) => {
    const token = req.headers.authorization || '';
    console.log("token", token)
    passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log("----")
        console.log("authenticate error",err)
        console.log("authenticate user",user)
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user, 'your_jwt_secret');

            return res.json({token});
        });

    })(req, res);
}

module.exports = {
    login,
};