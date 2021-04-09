const author = require('../models/authorModel')
const {AuthenticationError} = require("apollo-server-errors");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        author: (parent, args) => {
            return author.findById(args.id)
        },
        authors: (parent, args) => {
            return author
                .find()
        }
    },
    Mutation: {
        addAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            const newAuthor = new author(args)
            return newAuthor.save()
        },
        editAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return author.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        deleteAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return author.findOneAndDelete({_id: ObjectId(args.id)})
        },
    },
    Book: {
        author(parent) {
            return parent.Connections.map(async book =>
                author
                    .findById(book)
            )


        }
    }
}