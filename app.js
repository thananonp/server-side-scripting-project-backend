// import * as assert from "assert";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.URI
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("library").listCollections()
        let ass = await client.db("library").collection('staff').find({id: 1}).toArray()
        console.log(ass)
    } catch
        (e) {
        throw e;
    }
// finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
// }
}

run().catch(console.dir);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// const staffRouter = require('./routes/staff')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/staff', staffRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
