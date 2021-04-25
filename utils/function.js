const crypto = require("crypto");
const generateRandomName = crypto.randomBytes(10).toString('hex');

module.exports = {generateRandomName}