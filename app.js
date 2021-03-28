// import * as assert from "assert";

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser')
const jwt = require('./utils/jwt');
const errorHandler = require('./utils/jwt-error-handler');
const cors = require('cors')
const db = require('./utils/db')
app.use(cors())

db.on('connected', () => {
    app.listen(3000);
});



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(jwt())
app.use(errorHandler)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const staffRouter = require('./routes/staffRoute')
app.use('/staff', staffRouter);

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
