const db = require('../utils/db')
const secret = process.env.SECRETJWT
const jwt = require('jsonwebtoken');
const staff = require('../models/staffModel')

const getStaff = async (email) => {
    const user = await staff.findOne({email: email})
    if (user) return user
    else {
        return false
    }
}
const getAllStaff = async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    await staff
        .find({})
        .then(allStaffs => res.send(allStaffs))
        .catch(e => res.status(400).send(e))
}

const addNewStaff = async (req, res) => {
    const newStaff = req.body
    await staff
        .create(newStaff)
        .then(newStaff => res.send(newStaff))
        .catch(e => {
            res.sendStatus(400)
        });
}

const deleteStaff = async (req, res) => {
    let email = req.params.email
    await staff
        .deleteOne({"email": email})
        .then(
            res.sendStatus(204)
        ).catch(e => {
            console.log(e)
            res.sendStatus(404)
        });
}

const editStaff = async (req, res) => {
    let email = req.params.email
    await staff
        .findOneAndUpdate({email: email}, {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        }, {new: true})
        .then(result => {
            if (result) {
                console.log("RESULT", result)
                res.send(result)
            } else {
                res.sendStatus(404)
            }
        }).catch(e => {
            console.log(e)
            res.sendStatus(400)
        })

}

const authenticate = async (req, res) => {
    let user = await staff.findOne({email: req.body.email, password: req.body.password})
    if (!user) {
        res.status(422).json({error: "Could not process data"})
    } else {
        const token = jwt.sign({sub: user.id}, secret, {expiresIn: '7d'});

        res.status(200).json({user: user, token: token})
    }
}
module.exports = {
    getStaff,
    getAllStaff,
    addNewStaff,
    deleteStaff,
    editStaff,
    authenticate
}
