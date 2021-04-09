const mongoose = require('mongoose')
const Schema = mongoose.Schema
const author = new Schema({
        name: {type: String},
        biography: {type: String}
    }, {collection: 'authors'}
)

module.exports = mongoose.model('author', author)