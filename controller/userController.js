"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const passport = require("passport");
require("dotenv").config();

const getUser = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) return user;
  else {
    return false;
  }
};

const authenticate = async (req, res) => {
  passport.authenticate("user-local", { session: false }, (err, user, info) => {
    if (err || !user) {
      if (err === 401) {
        return res.status(401).json({
          message: "Something is not right",
        });
      } else if (err === 404) {
        return res.status(404).json({
          message: "Invalid credential",
        });
      } else {
        return res.status(400).json({
          message: "Bad request",
        });
      }
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ ...user, type: "user" }, process.env.SECRETJWT);

      return res.json({ token });
    });
  })(req, res);
};
module.exports = {
  getUser,
  authenticate,
};
