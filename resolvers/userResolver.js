const user = require('../models/userModel')
const book = require('../models/bookModel')
const bcrpyt = require('bcrypt')
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        user: (parent, args) => {
            return user
                .findById(args.id)

        },
        users: (parent, args) => {
            if (args.borrowed) {
                return user
                    .find({currentlyBorrowed: {$ne: null}})
            } else if (args.borrowed === false) {
                return user
                    .find({currentlyBorrowed: {$eq: null}})
            } else {
                return user
                    .find()
            }

        },
        userComparePassword: async (parent, args) => {
            console.log("args.password", args.password)
            return await user.findById(args.id).then(result => {
                console.log("REAL", result.password)
                return bcrpyt.compare(args.password, result.password)
                // compareUser = result
            })
            // console.log(compareUser)
            // return bcrpyt.compare(args.password, compareUser.password)
            // , (err, result) => {
            //     if (result) {
            //         console.log("return true")
            //         // returnBoolean = true
            //         return true
            //     } else {
            //         // returnBoolean = false
            //         console.log("return false")
            //         return false
            //     }
            // })
            //     .then(async result => {
            //     console.log("result.password", result.password)
            //     return await bcrpyt.compare(args.password, result.password, async (err, result) => {
            //         // console.log(err)
            //         // console.log(result)
            //         if (result) {
            //             console.log("return true")
            //             // returnBoolean = true
            //             return true
            //         } else {
            //             returnBoolean = false
            //             console.log("return false")
            //             return false
            //         }
            //     })
            // })
            // console.log("FINALLY")
            // console.log("b ", b)
            // return returnBoolean
        }
    },
    Mutation: {
        addUser: async (parent, args, context) => {
            // email dupe is checked
            // if (!context.user) {
            //     throw new AuthenticationError("authentication failed");
            // }
            args.password = await bcrpyt.hash(args.password, 12)
            const newUser = new user(args)
            return newUser.save()
        },
        editUser: async (parent, args, context) => {
            //if id is incorrect then return null, email dupe is checked
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            // args.password = await bcrpyt.hash(args.password, 12)
            console.log(args)
            return user.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        changePasswordUser: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }

            console.log(args)
            args.password = await bcrpyt.hash(args.password, 12)
            return user.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        deleteUser: async (parent, args, context) => {
            //no check if the id is correct or not just delete and always return null
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            try {
                // console.log("deleteUser", args.id)
                await book.findOneAndUpdate({borrowedBy: args.id}, {borrowedBy: null})
                return user.findOneAndDelete({_id: ObjectId(args.id)})
            } catch (e) {
                return false
            }

        },
    },
    Book: {
        borrowedBy(parent) {
            console.log("user", parent)
            return (
                user
                    .findById(parent.borrowedBy)
            )
        }
    }
}