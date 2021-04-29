const crypto = require("crypto");
const preference = require('../models/preferenceModel.js')
preference.countDocuments((err, count) => {
    if (err) {
        console.error(err)
    }
    if (count === 0) {
        new preference().save()
    }
})

const generateRandomName = crypto.randomBytes(10).toString('hex');

module.exports = {generateRandomName}