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

router.post('/add', async function (req, res) {
    const collection = db.get().collection('staff')
    let exist = await collection.find({email: req.body.email}).toArray()
    console.log(req.body)
    if (exist[0] === undefined) {
        collection.insertOne(req.body)
        res.send("Insert ok")
    } else {
        res.send("Data already exist")
    }

})

module.exports = router;
