const db = require('../db')
const secret = process.env.SECRETJWT
const jwt = require('jsonwebtoken');


const getAllStaff = (req, res) => {
    const collection = db.get().collection('staff')
    collection.find().toArray(function (err, docs) {
        res.send(docs);
    })
}

const addNewStaff = async (req, res) => {
    const collection = db.get().collection('staff')
    let exist = await collection.find({email: req.body.email}).toArray()
    console.log(req.body)
    if (exist[0] === undefined) {
        collection.insertOne(req.body)
        res.send("Insert ok")
    } else {
        res.send("Data already exist")
    }
}

const deleteStaff = async (req, res) => {
    let email = req.params.email
    const collection = db.get().collection('staff')
    let exist = await collection.find({email: email}).toArray()
    if (exist[0] === undefined) {
        res.send("There is no data to be deleted")
    } else {
        collection.deleteOne({email: email})
        res.send("Data Deleted")
    }
}

const editStaff = async (req, res) => {
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

}

const authenticate = async (req, res) => {
    const collection = db.get().collection('staff')
    // let user = await collection.findOne({email: email, password: password})
    let user = await collection.findOne({email: req.body.email, password: req.body.password})
    // const user = users.find(u => u.username === email && u.password === password);

    if (!user) {
        res.status(422).json({error: "Could not process data"})
    } else {
        const token = jwt.sign({sub: user.id}, secret, {expiresIn: '7d'});

        res.status(200).json({user: user, token: token})
    }
}
module.exports = {
    getAllStaff,
    addNewStaff,
    deleteStaff,
    editStaff,
    authenticate
}
