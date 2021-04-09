const mongoose = require('mongoose')
const Schema = mongoose.Schema
const publisher = new Schema({
        name: {type: String},
        description: {type: String}
    }, {collection: 'publishers'}
)

module.exports = mongoose.model('publisher', publisher)