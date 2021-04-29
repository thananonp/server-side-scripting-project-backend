const mongoose = require('mongoose')
const Schema = mongoose.Schema
const preference = new Schema({
        fineRate: {
            type: Number,
            default: 3,
            min: [1, 'We gonna punish the late return!!'],
            max: [20, 'I think that maybe a little bit too much?']
        },
        borrowableDay: {
            type: Number,
            default: 5,
            min: [1, "I can't even finish a single chapter!"],
            max: [7, 'More than a week?. You need to share!']
        }
    }, {collection: 'preferences'}
)
module.exports = mongoose.model('preference', preference)