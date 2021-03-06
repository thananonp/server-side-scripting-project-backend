"use strict";

const { deletePicture, uploadPicture } = require("../utils/firebaseInit");
const { AuthenticationError } = require("apollo-server-errors");
const publisher = require("../models/publisherModel.js");

module.exports = {
  Query: {
    publisher: async (parent, args) => {
      return publisher.findById(args.id);
    },
    publishers: async (parent, args) => {
      const limit = args.limit || null;
      const skip = args.skip || null;
      return publisher.find().limit(limit).skip(skip);
    },
    countPublisher: async () => {
      return publisher.count();
    },
  },
  Mutation: {
    addPublisher: async (parent, args, context) => {
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
      const newPublisher = new publisher(args);
      return await newPublisher.save();
    },
    editPublisher: async (parent, args, context) => {
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
        return publisher.findOneAndUpdate({ _id: args.id }, args, {
          new: true,
        });
      } else {
        return publisher.findOneAndUpdate({ _id: args.id }, args, {
          new: true,
        });
      }
    },
    deletePublisher: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      publisher.findOneAndDelete({ _id: args.id }).then((data) => {
        deletePicture(data.imageUrl);
      });
    },
  },
  Book: {
    publisher(parent) {
      return publisher.findById(parent.publisher);
    },
  },
};
