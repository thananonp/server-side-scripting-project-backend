"use strict";

const ObjectId = require("mongoose").Types.ObjectId;
const { AuthenticationError } = require("apollo-server-errors");
const category = require("../models/categoryModel.js");
const { deletePicture, uploadPicture } = require("../utils/firebaseInit.js");

module.exports = {
  Query: {
    category: (parent, args) => {
      return category.findById(args.id);
    },
    categories: (parent, args) => {
      const limit = args.limit || null;
      const skip = args.skip || null;
      return category.find().limit(limit).skip(skip);
    },
    countCategory: async () => {
      return category.count();
    },
  },
  Mutation: {
    addCategory: async (parent, args, context) => {
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
      const newCategory = new category(args);
      return newCategory.save();
    },
    editCategory: async (parent, args, context) => {
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
        return category.findOneAndUpdate({ _id: ObjectId(args.id) }, args, {
          new: true,
        });
      } else {
        return category.findOneAndUpdate({ _id: ObjectId(args.id) }, args, {
          new: true,
        });
      }
    },
    deleteCategory: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      return category
        .findOneAndDelete({ _id: ObjectId(args.id) })
        .then((data) => {
          deletePicture(data.imageUrl);
        });
    },
  },
  Book: {
    category(parent) {
      return category.findById(parent.category);
    },
  },
};
