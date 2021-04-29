const preference = require('../models/preferenceModel.js')
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        preference: (parent, args) => {
            return preference.findOne()
        }
    },
    Mutation: {
        editPreference: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return preference.findOneAndUpdate({_id: args.id}, args, {new: true, runValidators: true,})

        }
    }
}