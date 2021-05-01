"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrpyt = require("bcrypt");

const staff = new Schema(
  {
    firstName: { type: String, required: true, default: "defaultFirstName" },
    lastName: { type: String, required: true, default: "defaultLastName" },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
      default: "defaultAdmin@admin.com",
    },
    password: { type: String, required: true, default: "Password!123" },
    type: { type: String, default: "staff" },
  },
  { collection: "staffs" }
);

staff.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrpyt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("staff", staff);
