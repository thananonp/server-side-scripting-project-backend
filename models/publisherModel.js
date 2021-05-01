"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const publisher = new Schema(
  {
    description: { type: String, required: true },
    name: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    imageUrl: { type: String, required: true },
  },
  { collection: "publishers" }
);

module.exports = mongoose.model("publisher", publisher);
