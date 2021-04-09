const mongoose = require('mongoose')
const Schema = mongoose.Schema
const book = new Schema({
        title: {type: String},
        description: {type: String},
        dateOfPublication: {type: String},
        pageCount: {type: Number},
        category: {
            type: Schema.Types.ObjectId, ref: 'category'
        },
        publisher: {
            type: Schema.Types.ObjectId, ref: 'publisher'
        },
        author: {
            type: Schema.Types.ObjectId, ref: 'author'
        },
        borrowedBy: {
            type: Schema.Types.ObjectId, ref: 'user'
        }
    }, {collection: 'books'}
)

module.exports = mongoose.model('book', book)