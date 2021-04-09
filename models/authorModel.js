const mongoose = require('mongoose')
const Schema = mongoose.Schema
const author = new Schema({
        name: {type: String, index: true, unique: true},
        biography: {type: String}
    }, {collection: 'authors'}
)

module.exports = mongoose.model('author', author)