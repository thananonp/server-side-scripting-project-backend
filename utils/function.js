"use strict";

const crypto = require("crypto");
const preference = require("../models/preferenceModel.js");
const staff = require("../models/staffModel.js");
const passport = require("./passportAuth.js");

//Initialization
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
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        (err, user, staff, info) => {
          if (!user && !staff) {
            reject("No matching");
          }
          if (user) {
            resolve(user);
          } else if (staff) {
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
