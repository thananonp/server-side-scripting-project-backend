const book = require('../models/bookModel')
const publisher = require('../models/publisherModel')
const author = require('../models/authorModel')
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
                return publisher.find({name: {"$regex": args.query, "$options": "i"}}).then(
                    result => {
                        console.log("result", result)
                        const idArray = result.map(i => {
                            return i._id
                        })
                        return book.find({publisher:{"$in":idArray}})
                            // .then(result => {
                            //     console.log("bookfindresult", result)
                            // })
                    }
                )
                // console.log("findPublisher", findPublisher)
                // return findPublisher
                // console.log("findPublisher",findPublisher._id)
                // findPublisher.map(async publisher => {
                //     console.log("Publisher", publisher._id)
                //      book.find({publisher: publisher._id}).then(book =>
                //         result.push(book))
                //     // console.log(book.find({publisher: publisher._id}))
                //     // result.push(book.find({publisher: publisher._id}))
                // }).then(i => console.log("result", result)
                // )
                // console.log(findPublisher._id)
                // return book.find({publisher: findPublisher._id})
            } else if (args.scope === 'author') {
                return author.find({name: {"$regex": args.query, "$options": "i"}}).then(
                    result => {
                        console.log("result", result)
                        const idArray = result.map(i => {
                            return i._id
                        })
                        return book.find({author:{"$in":idArray}})
                        // .then(result => {
                        //     console.log("bookfindresult", result)
                        // })
                    }
                )
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