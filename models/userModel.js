const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {
            type: String,
            unique: true,
            index: true
        },
        password: {type: String, required: true},
    }, {collection: 'users'}
)

module.exports = mongoose.model('user', user)