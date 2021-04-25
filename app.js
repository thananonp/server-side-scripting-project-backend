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

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// const staffRouter = require('./routes/staffRoute')
// const bookRouter = require('./routes/bookRoute')
// const authorRouter = require('./routes/authorRoute')
// const publisherRouter = require('./routes/publisherRoute')
// app.use('/staff', staffRouter);
// app.use('/book', bookRouter)
// app.use('/author', authorRouter)
// app.use('/publisher', publisherRouter)

const checkAuth = (req, res) => {
    try {
        console.log('checkAuth req', req.headers.authorization)
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                {session: false},
                (err, user, staff, info) => {
                    console.log("=====CHECK-AUTH====")
                    console.log("err",err)
                    console.log("user",user)
                    console.log("staff",staff)
                    console.log("info",info)
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
        // app.use('/cors-enabled', cors(), (req, res) => {
        //     res.json({msg: 'This is CORS-enabled for a Single Route'})
        // })
        // app.use('/auth', require('./routes/authRoute'))
        // // app.use('/chargemap', checkAuth, require('./routes/chargemapRoute'))
        // app.use('/chargemap', passport.authenticate('jwt', {session: false}), require('./routes/chargemapRoute'))
        app.get('/', (req, res) => {
            res.send('Hello Secure World!');
        });
        app.use('/author',require('./routes/authorRoute'))
        app.use('/staff', require('./routes/staffRoute'))
        app.use('/user', require('./routes/userRoute'))


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
