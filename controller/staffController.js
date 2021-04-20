const jwt = require('jsonwebtoken');
const staff = require('../models/staffModel')
const passport = require('passport')
require('dotenv').config();
const bcrypt = require("bcrypt");

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
    passport.authenticate('staff-local', {session: false}, (err, user, info) => {
        console.log("==== in StaffController")
        console.log("err",err)
        console.log("user",user)
        console.log("info",info)
        if (err || !user) {
            if (err === 401) {
                return res.status(401).json({
                    message: 'Something is not right',
                });
            } else if (err === 404) {
                return res.status(404).json({
                    message: 'Invalid credential',
                });
            } else {
                return res.status(400).json({
                    message: 'Bad request',
                });
            }
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // console.log(user)
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign({...user, type:'staff'}, process.env.SECRETJWT);

            return res.json({token});
        });

    })(req, res);
}
module.exports = {
    getStaff,
    getAllStaff,
    addNewStaff,
    deleteStaff,
    editStaff,
    authenticate
}
