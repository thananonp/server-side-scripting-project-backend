const mongoose = require('mongoose')
const Schema = mongoose.Schema
const book = new Schema({
        isbn: {type: String},
        title: {type: String},
        year: {type: String},
        writer: {
            type: Schema.Types.ObjectId, ref: 'author'
        },
        publisher: {
            type: Schema.Types.ObjectId, ref: 'publisher'
        }
    }, {collection: 'books'}
)

module.exports = mongoose.model('book', book)