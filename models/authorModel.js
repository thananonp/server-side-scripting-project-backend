const mongoose = require('mongoose')
const Schema = mongoose.Schema
const author = new Schema({
        firstName: {type: String},
        lastName: {type: String}
    }, {collection: 'authors'}
)

module.exports = mongoose.model('author', author)