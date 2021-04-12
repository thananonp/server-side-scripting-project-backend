const book = require('../models/bookModel')
const publisher = require('../models/publisherModel')
const author = require('../models/authorModell')
const user = require('../models/userModel')
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
        },
        searchBooks: async (parent, args) => {
            console.log(args)
            if (args.scope === 'title') {
                return book.find({title: args.query})
            } else if (args.scope === 'publisher') {
                const findPublisher = await publisher.findOne({name: args.query})
                // console.log(findPublisher)
                // console.log(findPublisher._id)
                return book.find({publisher: findPublisher._id})
            } else if (args.scope === 'author') {
                const findAuthor = await author.findOne({name: args.query})
                // console.log(findPublisher)
                // console.log(findPublisher._id)
                return book.find({author: findAuthor._id})
            }
            // return book
            //     .find()
            //     .limit(args.limit ? args.limit : 10)
        }
    },
    Mutation: {
        addBook: async (parent, args, context) => {
            console.log("addBook args", args)
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
            return book.findOneAndDelete({_id: ObjectId(args.id)})
        },
        updateBookBorrow: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            console.log(args)
            return book.findOneAndUpdate({_id: ObjectId(args.id)}, args, {new: true})
        },
        clearBookBorrow: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            let borrowedBy = {borrowedBy: null}
            return book.findOneAndUpdate({_id: ObjectId(args.id)}, borrowedBy, {new: true})
        },
    },
    //TODO clearBookBorrow
}