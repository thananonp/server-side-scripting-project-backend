const book = require('../models/bookModel')
const publisher = require('../models/publisherModel')
const author = require('../models/authorModel')
const user = require('../models/userModel')
const {uploadPicture} = require("../utils/firebaseInit");
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        book: (parent, args) => {
            return book.findById(args.id)
        },
        books: (parent, args) => {
            if (args.borrowed) {
                return book
                    .find({borrowedBy: {$ne: null}})
            } else if (args.borrowed === false) {
                return book
                    .find({borrowedBy: {$eq: null}})
            } else if (args.category) {
                return book
                    .find({category: args.category})
            } else if (args.author) {
                return book
                    .find({author: args.author})
            } else if (args.publisher) {
                return book
                    .find({publisher: args.publisher})
            } else {
                return book
                    .find()
                // .limit(args.limit ? args.limit : 10)
            }
        },
        searchBooks: async (parent, args) => {
            console.log(args)
            if (args.scope === 'title') {
                return book.find({title: {"$regex": args.query, "$options": "i"}})
            } else if (args.scope === 'publisher') {
                return publisher.find({name: {"$regex": args.query, "$options": "i"}}).then(
                    result => {
                        console.log("result", result)
                        const idArray = result.map(i => {
                            return i._id
                        })
                        return book.find({publisher: {"$in": idArray}})
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
                        return book.find({author: {"$in": idArray}})
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
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            const {createReadStream, filename, mimetype, encoding} = await args.file
            args.imageUrl = await uploadPicture(createReadStream, filename, mimetype, encoding)
            const newBook = new book(args)
            return newBook.save()
        },
        editBook: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            if (args.file) {
                const {createReadStream, filename, mimetype, encoding} = await args.file
                args.imageUrl = await uploadPicture(createReadStream, filename, mimetype, encoding)
                return book.findOneAndUpdate({_id: ObjectId(args.id)}, args, {new: true})
            } else {
                return book.findOneAndUpdate({_id: ObjectId(args.id)}, args, {new: true})
            }
        },
        deleteBook: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            return book.findOneAndDelete({_id: ObjectId(args.id)})
        },
        updateBookBorrow: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            console.log(args)
            args.dateOfBorrow = Date.now()
            try {
                await user.findOneAndUpdate({_id: args.borrowedBy}, {currentlyBorrowed: args.id})
                await book.findOneAndUpdate({_id: ObjectId(args.id)}, args, {new: true})
                return true

            } catch (e) {
                return false
            }
        },
        clearBookBorrow: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            try {
                await book.findOneAndUpdate({_id: ObjectId(args.id)}, {borrowedBy: null}, {new: false}, async (error, result) => {
                    console.log("book clearBookBorrowed", result)
                    await user.findOneAndUpdate({_id: result.borrowedBy}, {currentlyBorrowed: null})
                    return true
                })
            } catch (e) {
                return false
            }
        },
    },
    User: {
        currentlyBorrowed(parent) {
            // console.log("book", parent)
            return book.findById(parent.currentlyBorrowed)
        }
    }
}