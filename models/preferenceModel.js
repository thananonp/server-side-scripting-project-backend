const mongoose = require('mongoose')
const Schema = mongoose.Schema
const preference = new Schema({
        fineRate: {
            type: Number,
            default: 3
        },
        borrowableDay: {
            type: Number,
            default: 5
        }
    }, {collection: 'preferences'}
)
module.exports = mongoose.model('preference', preference)