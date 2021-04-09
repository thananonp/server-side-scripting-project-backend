const book = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        book: (parent, args) => {
            return book.findById(args.id)
        },
        books: (parent, args) => {
            return book
                .find()
                .limit(args.limit ? args.limit : 10)
        }
    },
    Mutation: {
        addBook: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            const newBook = new book(args)
            return newBook.save()
        },
        editBook: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return book.findOneAndUpdate({_id: ObjectId(args.id)}, args, {new: true})
        },
        deleteBook: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return book.deleteOne({_id: ObjectId(args.id)})
        },
    },
}