'use strict';
const mongoose = require('mongoose')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {ApolloServer} = require('apollo-server-express')
const logger = require('morgan');
const bodyParser = require('body-parser')
// const jwt = require('./utils/jwt');
const errorHandler = require('./utils/jwt-error-handler');
const cors = require('cors')
const schemas = require('./schemas/index.js');
const resolvers = require('./resolvers/index.js');

const helmet = require('helmet')
const passport = require('./utils/passportAuth');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:8001',
    credentials: true // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));

// app.use(jwt())
app.use(errorHandler)


const checkAuth = (req, res) => {
    try {
        console.log('checkAuth req', req.headers.authorization)
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                {session: false},
                (err, user, staff, info) => {
                    console.log("=====CHECK-AUTH====")
                    console.log("err", err)
                    console.log("user", user)
                    console.log("staff", staff)
                    console.log("info", info)
                    if (!user && !staff) {
                        reject("No matching")
                    }
                    if (user) {
                        console.log("Resolve USER")
                        resolve(user);
                    } else if (staff) {
                        console.log("Resolve STAFF")
                        resolve(staff);
                    }
                }
            )(req, res);
        });
    } catch (err) {
        throw err;
    }
}

(async () => {
    try {
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('MongoDB connected successfully');


        const server = new ApolloServer({
            typeDefs: schemas,
            resolvers,
            context: async ({req, res}) => {
                if (req) {
                    const user = await checkAuth(req, res)
                    // const user = true
                    return {req, res, user}
                }
            },

        });
        server.applyMiddleware({app});
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
        if (process.env.NODE_ENV === 'production') {
            const production = require("./sec/production");
            production(app, 3000);
        } else {
            const localhost = require("./sec/localhost");
            localhost(app, 8000, 3000);
        }

        app.use(helmet({
            contentSecurityPolicy: false,
            ieNoOpen: false
        }))

        app.get('/', (req, res) => {
            res.send('Hello Secure World!');
        });


        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            next(createError(404));
        });

        // error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.sendStatus(404)

        });

    } catch (e) {
        console.log('server error: ' + e.message);
    }
})();


module.exports = app;
