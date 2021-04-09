const mongoose = require('mongoose')
const Schema = mongoose.Schema
const category = new Schema({
        title: {
            type: String,
            required: true,
            unique: true,
            index: true
        }
    }, {collection: 'categories'}
)

module.exports = mongoose.model('category', category)