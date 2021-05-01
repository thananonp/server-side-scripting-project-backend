"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const book = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateOfPublication: { type: String, required: true },
    pageCount: {
      type: Number,
      required: true,
      min: [1, "That is a page not a book!"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    publisher: {
      type: Schema.Types.ObjectId,
      ref: "publisher",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "author",
    },
    borrowedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    dateOfBorrow: {
      type: Date,
    },
    imageUrl: { type: String, required: true },
  },
  { collection: "books" }
);

module.exports = mongoose.model("book", book);
