const user = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        user: (parent, args) => {
            user.find(
                args.id()
            )
        },
        users: (parent, args) => {
            return user
                .find()
        }
    },
    Mutation: {
        addUser: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            const newUser = new user(args)
            return newUser.save()
        },
        editUser: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return user.findOneAndUpdate(args.id, args, {new: true})
        },
        deleteUser: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return user.deleteOne({_id: ObjectId(args.id)})
        },
    },
}