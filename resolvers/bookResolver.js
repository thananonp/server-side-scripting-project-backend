"use strict";

const ObjectId = require("mongoose").Types.ObjectId;
const { AuthenticationError } = require("apollo-server-errors");
const book = require("../models/bookModel.js");
const publisher = require("../models/publisherModel.js");
const author = require("../models/authorModel.js");
const user = require("../models/userModel.js");
const { deletePicture, uploadPicture } = require("../utils/firebaseInit.js");

module.exports = {
  Query: {
    book: (parent, args) => {
      return book.findById(args.id);
    },
    books: (parent, args) => {
      const limit = args.limit || null;
      const skip = args.skip || null;
      if (args.borrowed) {
        return book.find({ borrowedBy: { $ne: null } });
      } else if (args.borrowed === false) {
        return book.find({ borrowedBy: { $eq: null } });
      } else if (args.author) {
        return book.find({ author: args.author });
      } else if (args.publisher) {
        return book.find({ publisher: args.publisher });
      } else if (args.category) {
        return book.find({ category: args.category });
      } else {
        return book.find().limit(limit).skip(skip);
      }
    },
    searchBooks: async (parent, args) => {
      const limit = args.limit || null;
      const skip = args.skip || null;
      if (args.scope === "title") {
        return book
          .find({ title: { $regex: args.query, $options: "i" } })
          .limit(limit)
          .skip(skip);
      } else if (args.scope === "publisher") {
        return publisher
          .find({ name: { $regex: args.query, $options: "i" } })
          .then((result) => {
            const idArray = result.map((i) => {
              return i._id;
            });
            return book
              .find({ publisher: { $in: idArray } })
              .limit(limit)
              .skip(skip);
          });
      } else if (args.scope === "author") {
        return author
          .find({ name: { $regex: args.query, $options: "i" } })
          .then((result) => {
            const idArray = result.map((i) => {
              return i._id;
            });
            return book
              .find({ author: { $in: idArray } })
              .limit(limit)
              .skip(skip);
          });
      }
    },
    countBook: async () => {
      return book.count();
    },
    countBookSearch: async (parent, args) => {
      if (args.scope === "title") {
        return book.count({ title: { $regex: args.query, $options: "i" } });
      } else if (args.scope === "publisher") {
        return publisher
          .find({ name: { $regex: args.query, $options: "i" } })
          .then((result) => {
            const idArray = result.map((i) => {
              return i._id;
            });
            return book.count({ publisher: { $in: idArray } });
          });
      } else if (args.scope === "author") {
        return author
          .find({ name: { $regex: args.query, $options: "i" } })
          .then((result) => {
            const idArray = result.map((i) => {
              return i._id;
            });
            return book.count({ author: { $in: idArray } });
          });
      }
    },
  },
  Mutation: {
    addBook: async (parent, args, context) => {
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
      const newBook = new book(args);
      return newBook.save();
    },
    editBook: async (parent, args, context) => {
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
        return book.findOneAndUpdate({ _id: ObjectId(args.id) }, args, {
          new: true,
        });
      } else {
        return book.findOneAndUpdate({ _id: ObjectId(args.id) }, args, {
          new: true,
        });
      }
    },
    deleteBook: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      return book.findOneAndDelete({ _id: ObjectId(args.id) }).then((data) => {
        deletePicture(data.imageUrl);
      });
    },
    updateBookBorrow: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      args.dateOfBorrow = Date.now();
      try {
        await user.findOneAndUpdate(
          { _id: args.borrowedBy },
          { currentlyBorrowed: args.id }
        );
        await book.findOneAndUpdate({ _id: ObjectId(args.id) }, args, {
          new: true,
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    clearBookBorrow: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      try {
        await book.findOneAndUpdate(
          { _id: ObjectId(args.id) },
          { borrowedBy: null },
          { new: false },
          async (error, result) => {
            await user.findOneAndUpdate(
              { _id: result.borrowedBy },
              { currentlyBorrowed: null }
            );
            return true;
          }
        );
      } catch (e) {
        return false;
      }
    },
  },
  User: {
    currentlyBorrowed(parent) {
      return book.findById(parent.currentlyBorrowed);
    },
  },
};
