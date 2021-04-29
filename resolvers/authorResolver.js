'use strict';

const {AuthenticationError} = require("apollo-server-errors");
const ObjectId = require('mongoose').Types.ObjectId;
const author = require('../models/authorModel.js')
const {deletePicture,uploadPicture} = require("../utils/firebaseInit.js");

module.exports = {
    Query: {
        author: (parent, args) => {
            return author.findById(args.id);
        },
        authors: (parent, args) => {
            return author
                .find();
        }
    },
    Mutation: {
        addAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            const {createReadStream, filename, mimetype, encoding} = await args.file;
            args.imageUrl = await uploadPicture(createReadStream, filename, mimetype, encoding);
            const newPublisher = new author(args);
            return await newPublisher.save();

        },
        editAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            if (args.file) {
                const {createReadStream, filename, mimetype, encoding} = await args.file;
                args.imageUrl = await uploadPicture(createReadStream, filename, mimetype, encoding);
                return author.findOneAndUpdate({_id: args.id}, args, {new: true});
            } else {
                return author.findOneAndUpdate({_id: args.id}, args, {new: true});
            }
        },
        deleteAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return author.findOneAndDelete({_id: ObjectId(args.id)}).then(
                (data) => {
                    // console.log(data)
                    deletePicture(data.imageUrl);
                }
            )
        },
    },
    Book: {
        author(parent) {
            // console.log("author", parent);
            return (
                author
                    .findById(parent.author)
            );
        }
    }
}