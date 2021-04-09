const staff = require('../models/staffModel')
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        staff: (parent, args) => {
            return staff
                .findById(args.id)
        },
        staffs: (parent, args) => {
            return staff
                .find()
        }
    },
    Mutation: {
        addStaff: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            const newStaff = new staff(args)
            return newStaff.save()
        },
        editStaff: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return staff.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        deleteStaff: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return staff.findOneAndDelete({_id: ObjectId(args.id)})
        },
    },
}