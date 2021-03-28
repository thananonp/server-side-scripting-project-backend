//module is in strict mode by default ;)
const mongoose = require('mongoose');
const config = require('./config');

(async () => {
    try {
        await mongoose.connect(config.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB connected successfully');
    } catch (err) {
        console.error('Connection to db failed', err);
    }
})();

module.exports = mongoose.connection;
