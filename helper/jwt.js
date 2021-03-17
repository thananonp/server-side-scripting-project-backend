const expressJwt = require('express-jwt');
const config = process.env.SECRETJWT

module.exports = jwt;

function jwt() {
    const {secret} = config;
    return expressJwt({secret, algorithms: ['HS256']}).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate'
        ]
    });
}