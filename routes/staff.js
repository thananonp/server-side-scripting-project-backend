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

//Registration
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

//Delete account
router.delete('/delete/:email', async function (req, res) {
    let email = req.params.email
    const collection = db.get().collection('staff')
    let exist = await collection.find({email: email}).toArray()
    if (exist[0] === undefined) {
        res.send("There is no data to be deleted")
    } else {
        collection.deleteOne({email: email})
        res.send("Data Deleted")
    }
})

//Edit account
router.put('/edit/:email', async function (req, res) {
    let email = req.params.email
    const collection = db.get().collection('staff')
    let oldStaff = await collection.find({email: email}).toArray()
    if (oldStaff[0] === undefined) {
        res.send("There is no data to be edited")
    } else {
        try {
            await collection.updateOne({email: email}, {$set: req.body})
            res.send("Edit completed")
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }

})

module.exports = router;
