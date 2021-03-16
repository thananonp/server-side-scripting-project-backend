require('dotenv').config();
const uri = process.env.URI
const MongoClient = require('mongodb').MongoClient

const state = {
    db: null,
}


exports.connect = function (done) {
    if (state.db) return done()

    MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) return done(err)
        state.db = db.db("library")
        done()
    })
}

exports.get = function () {
    return state.db
}

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}