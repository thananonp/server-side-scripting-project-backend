const express = require('express');
const router = express.Router();
const db = require('../db')


/* GET users listing. */
router.get('/getAll', function (req, res, next) {
    const collection = db.get().collection('staff')
    collection.find().toArray(function (err, docs) {
        res.send(docs);
    })
});

module.exports = router;
