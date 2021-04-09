const publisher = require('../models/publisherModel')
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        publisher: (parent, args) => {
            return publisher
                .findById(args.id)
        },
        publishers: (parent, args) => {
            return publisher
                .find()
        }
    },
    Mutation: {
        addPublisher: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            const newPublisher = new publisher(args)
            return newPublisher.save()
        },
        editPublisher: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return publisher.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        deletePublisher: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return publisher.findOneAndDelete({_id: args.id})
        },
    },
}