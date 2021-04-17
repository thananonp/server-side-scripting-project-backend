const staff = require('../models/staffModel')
const bcrpyt = require("bcrypt");
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
        },
        staffComparePassword: async (parent, args) => {
            console.log("args.password", args.password)
            return await staff.findById(args.id).then(result => {
                console.log("REAL", result.password)
                return bcrpyt.compare(args.password, result.password)
                // compareUser = result
            })
        }
    },
    Mutation: {
        addStaff: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            args.password = await bcrpyt.hash(args.password, 12)
            const newStaff = new staff(args)
            return newStaff.save()
        },
        editStaff: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return staff.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        changePasswordStaff: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }

            console.log(args)
            args.password = await bcrpyt.hash(args.password, 12)
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