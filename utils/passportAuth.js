"use strict";

const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const staffController = require("../controller/staffController.js");
const userController = require("../controller/userController.js");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(
  "staff-local",
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        await staffController.getStaff(email).then((staff) => {
          bcrypt.compare(password, staff.password, (err, result) => {
            if (result) {
              setTimeout(() => {
                return done(
                  null,
                  { user: staff },
                  { message: "Logged In Successfully" }
                );
              }, 500);
            } else {
              setTimeout(() => {
                return done(Error("Invalid credential"), false, {
                  message: "Invalid credential.",
                });
              }, 500);
            }
          });
        });
      } catch (err) {
        console.log("error", err);
        return done(err);
      }
    }
  )
);

// local strategy user
passport.use(
  "user-local",
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        await userController.getUser(email).then((user) => {
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              setTimeout(() => {
                return done(
                  null,
                  { user },
                  { message: "Logged In Successfully" }
                );
              }, 500);
            } else {
              setTimeout(() => {
                return done(Error("Invalid credential"), false, {
                  message: "Invalid credential",
                });
              }, 500);
            }
          });
          // use spread syntax to create shallow copy to get rid of binary row type
        });
      } catch (err) {
        console.log("error", err);
        return done(err);
      }
    }
  )
);

//authenticate JWT token
passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRETJWT,
    },
    async function (jwtPayload, done) {
      try {
        if (jwtPayload.type === "user") {
          const user = await userController.getUser(jwtPayload.user.email);
          if (!bcrypt.compare(jwtPayload.user.password, user.password)) {
            return done(null, false, null, { message: "Incorrect password." });
          } else {
            return done(null, user, null, {
              message: "Logged In Successfully",
            });
          }
        } else if (jwtPayload.type === "staff") {
          const staff = await staffController.getStaff(jwtPayload.user.email);
          if (!bcrypt.compare(jwtPayload.user.password, staff.password)) {
            return done(null, null, false, { message: "Incorrect password." });
          } else {
            return done(null, null, staff, {
              message: "Logged In Successfully",
            });
          }
        }
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  )
);

module.exports = passport;
