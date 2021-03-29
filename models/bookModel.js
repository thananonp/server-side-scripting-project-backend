const mongoose = require('mongoose')
const Schema = mongoose.Schema
const author = new Schema({
        isbn: {type: String},
        title: {type: String},
        year: {type: String},
        publisher: {
            type: Schema.Types.ObjectId, ref: 'publisher'
        }
    }, {collection: 'authors'}
)

module.exports = mongoose.model('author', author)