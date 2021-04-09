'use strict';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../controller/staffController');
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");
const {hash} = require("bcrypt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(new Strategy({usernameField: "email", passwordField: "password"},
    async (email, password, done) => {
        // const params = username;
        try {
            const user = await userModel.getStaff(email);
            console.log("Strategy received password:",password)
            console.log("Strategy user password",user.password)
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
                    setTimeout(() => {
                        return done(null, {...user}, {message: 'Logged In Successfully'});
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
        } catch (err) {
            return done(err);
        }
    }));

//authen token
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
    },
    async function (jwtPayload, done) {
        try {

            console.log("JWT PAYLOAD", jwtPayload)
            //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
            const user = await userModel.getUserLogin(jwtPayload.email);
            console.log("JWTStrategy payload password",jwtPayload.password)
            console.log("JWTStrategy user password",user.password)
            // console.log('Local strategy', user); // result is binary row

            if (user.password !== jwtPayload.password) {
                console.log("JWTStrategy password incorrect")
                return done(null, false, {message: 'Incorrect password.'});
            }
            console.log("JWTStrategy successfully")

            return done(null, user, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
        } catch
            (err) {
            return done(err);
        }
    }
))
;

module.exports = passport;