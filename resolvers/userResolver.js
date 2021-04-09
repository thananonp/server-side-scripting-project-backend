const user = require('../models/userModel')
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
            return user
                .find()
        }
    },
    Mutation: {
        addUser: async (parent, args, context) => {
            // email dupe is checked
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            args.password = await bcrpyt.hash(args.password, 12)
            const newUser = new user(args)
            return newUser.save()
        },
        editUser: async (parent, args, context) => {
            //if id is incorrect then return null, email dupe is checked
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return user.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        deleteUser: async (parent, args, context) => {
            //no check if the id is correct or not just delete and always return null
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            console.log(args.id)
            return user.findOneAndDelete({_id: ObjectId(args.id)})

        },
    },
}