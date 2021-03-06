"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const category = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    imageUrl: { type: String, required: true },
  },
  { collection: "categories" }
);

module.exports = mongoose.model("category", category);
