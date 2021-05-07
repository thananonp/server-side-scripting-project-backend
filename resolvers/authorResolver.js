"use strict";

const { AuthenticationError } = require("apollo-server-errors");
const ObjectId = require("mongoose").Types.ObjectId;
const author = require("../models/authorModel.js");
const { deletePicture, uploadPicture } = require("../utils/firebaseInit.js");

module.exports = {
  Query: {
    author: async (parent, args) => {
      return author.findById(args.id);
    },
    authors: async (parent, args) => {
      const limit = args.limit || null;
      const skip = args.skip || null;
      return author.find().limit(limit).skip(skip);
    },
    countAuthor: async () => {
      return author.count();
    },
  },
  Mutation: {
    addAuthor: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      const {
        createReadStream,
        filename,
        mimetype,
        encoding,
      } = await args.file;
      args.imageUrl = await uploadPicture(
        createReadStream,
        filename,
        mimetype,
        encoding
      );
      const newAuthor = new author(args);
      return await newAuthor.save();
    },
    editAuthor: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      if (args.file) {
        const {
          createReadStream,
          filename,
          mimetype,
          encoding,
        } = await args.file;
        args.imageUrl = await uploadPicture(
          createReadStream,
          filename,
          mimetype,
          encoding
        );
        return author.findOneAndUpdate({ _id: args.id }, args, { new: true });
      } else {
        return author.findOneAndUpdate({ _id: args.id }, args, { new: true });
      }
    },
    deleteAuthor: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      return author
        .findOneAndDelete({ _id: ObjectId(args.id) })
        .then((data) => {
          deletePicture(data.imageUrl);
        });
    },
  },
  Book: {
    author(parent) {
      return author.findById(parent.author);
    },
  },
};
