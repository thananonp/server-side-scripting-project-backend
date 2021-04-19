'use strict';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const staffController = require('../controller/staffController');
const userController = require('../controller/userController');
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");
const {hash} = require("bcrypt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use('staff-local',
    new Strategy({usernameField: "email", passwordField: "password"},
        async (email, password, done) => {
            // const params = username;
            try {
                await staffController.getStaff(email)
                    .then(staff => {
                        console.log("Strategy received password:", password)
                        console.log("Strategy user password", staff.password)
                        // console.log('Strategy', user); // result is binary row
                        if (staff === undefined) {
                            console.log("Strategy user undefined")
                            setTimeout(() => {
                                return done(null, false, {message: 'Incorrect email.'});
                            }, 1000)
                        }
                        bcrypt.compare(password, staff.password, (err, result) => {
                            console.log("Strategy result", result)
                            if (result) {
                                console.log("Strategy logging in")
                                console.log("Staff =", staff)
                                const returnUser = staff
                                setTimeout(() => {
                                    return done(null, {user: staff}, {message: 'Logged In Successfully'});
                                }, 500)
                            } else {
                                console.log("Strategy password incorrect")
                                setTimeout(() => {
                                    return done(null, false, {message: 'Incorrect password.'});
                                }, 500)
                            }
                        })
                        console.log("Strategy successfully")

                        // use spread syntax to create shallow copy to get rid of binary row type
                    })

            } catch (err) {
                return done(err);
            }
        }));

// local strategy user
passport.use('user-local',
    new Strategy({usernameField: "email", passwordField: "password"},
        async (email, password, done) => {
            console.log("--- user-local strategy---")
            // const params = username;
            try {
                await userController.getUser(email)
                    .then(user => {
                        console.log("Strategy received password:", password)
                        console.log("Strategy user password", user.password)
                        // console.log('Strategy', user); // result is binary row
                        if (user === undefined) {
                            console.log("Strategy user undefined")
                            setTimeout(() => {
                                return done(null, false, {message: 'Incorrect email.'});
                            }, 1000)
                        }
                        bcrypt.compare(password, user.password, (err, result) => {
                            console.log("Strategy result", result)
                            if (result) {
                                console.log("Strategy logging in")
                                console.log("User =", user)
                                setTimeout(() => {
                                    return done(null, {user}, {message: 'Logged In Successfully'});
                                }, 500)
                            } else {
                                console.log("Strategy password incorrect")
                                setTimeout(() => {
                                    return done(null, false, {message: 'Incorrect password.'});
                                }, 500)
                            }
                        })
                        console.log("Strategy successfully")

                        // use spread syntax to create shallow copy to get rid of binary row type
                    })

            } catch (err) {
                return done(err);
            }
        }));

//authen token
passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRETJWT
    },
    async function (jwtPayload, done) {
        try {
            console.log("===jwt===")
            console.log("JWT PAYLOAD", jwtPayload)
            let user
            if (jwtPayload.type === 'user') {
                user = await userController.getUser(jwtPayload.user.email);
                console.log("JWTStrategy user payload password", jwtPayload.user.password)
                console.log("JWTStrategy user password", user.password)
            } else if (jwtPayload.type === 'staff') {
                user = await staffController.getStaff(jwtPayload.user.email);
                console.log("JWTStrategy user payload password", jwtPayload.user.password)
                console.log("JWTStrategy staff password", user.password)
            }
            //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

            // console.log('Local strategy', user); // result is binary row

            if (!bcrypt.compare(jwtPayload.user.password, user.password)) {
                console.log("JWTStrategy password incorrect")
                return done(null, false, {message: 'Incorrect password.'});
            } else {
                console.log("JWTStrategy successfully")
                return done(null, user, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type}
            }
        } catch
            (err) {
            console.error(err)
            return done(err);
        }
    }
))
;

module.exports = passport;