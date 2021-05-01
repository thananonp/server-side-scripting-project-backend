"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrpyt = require("bcrypt");

const user = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    password: { type: String, required: true },
    currentlyBorrowed: {
      type: Schema.Types.ObjectId,
      ref: "book",
    },
    type: { type: String, default: "user" },
  },
  { collection: "users" }
);

user.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrpyt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("user", user);
