const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staff = new Schema({
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {
            type: String,
            unique: true,
            index: true
        },
        password: {type: String, required: true},
    }, {collection: 'staffs'}
)

module.exports = mongoose.model('staff', staff)