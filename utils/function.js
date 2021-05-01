"use strict";

const crypto = require("crypto");
const preference = require("../models/preferenceModel.js");
const staff = require("../models/staffModel.js");
const passport = require("./passportAuth.js");

preference.countDocuments((err, count) => {
  if (err) {
    console.error(err);
  }
  if (count === 0) {
    new preference().save();
  }
});
staff.countDocuments((err, count) => {
  if (err) {
    console.error(err);
  }
  if (count === 0) {
    new staff().save();
  }
});

const checkAuth = (req, res) => {
  try {
    console.log("checkAuth req", req.headers.authorization);
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        (err, user, staff, info) => {
          console.log("=====CHECK-AUTH====");
          console.log("err", err);
          console.log("user", user);
          console.log("staff", staff);
          console.log("info", info);
          if (!user && !staff) {
            reject("No matching");
          }
          if (user) {
            console.log("Resolve USER");
            resolve(user);
          } else if (staff) {
            console.log("Resolve STAFF");
            resolve(staff);
          }
        }
      )(req, res);
    });
  } catch (err) {
    throw err;
  }
};

const generateRandomName = crypto.randomBytes(10).toString("hex");

module.exports = { generateRandomName, checkAuth };
