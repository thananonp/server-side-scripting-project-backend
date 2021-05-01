"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const author = new Schema(
  {
    name: { type: String, index: true, unique: true, required: true },
    biography: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { collection: "authors" }
);

module.exports = mongoose.model("author", author);
