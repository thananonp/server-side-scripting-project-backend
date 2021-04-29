'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrpyt = require("bcrypt");

const staff = new Schema({
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {
            type: String,
            unique: true,
            index: true
        },
        password: {type: String, required: true},
        type: {type: String, default: "staff"}
    }, {collection: 'staffs'}
);

staff.pre('save', async function (next) {    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrpyt.hash(this.password, 12);
        next()
    } catch (err) {
        next(err);
    }
})

module.exports = mongoose.model('staff', staff);