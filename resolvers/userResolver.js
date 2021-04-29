'use strict';

const bcrpyt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const {AuthenticationError} = require("apollo-server-errors");
const ObjectId = require('mongoose').Types.ObjectId;
const user = require('../models/userModel.js');
const book = require('../models/bookModel.js');

module.exports = {
    Query: {
        user: (parent, args) => {
            return user
                .findById(args.id);

        },
        users: (parent, args) => {
            if (args.borrowed) {
                return user
                    .find({currentlyBorrowed: {$ne: null}});
            } else if (args.borrowed === false) {
                return user
                    .find({currentlyBorrowed: {$eq: null}});
            } else {
                return user
                    .find();
            }

        },
        userComparePassword: async (parent, args) => {
            console.log("args.password", args.password)
            return await user.findById(args.id).then(result => {
                console.log("REAL", result.password);
                return bcrpyt.compare(args.password, result.password);
            })
        },
        userLogin: async (parent, args, {req, res}) => {
            try {
                return await new Promise((resolve, reject) => {
                    passport.authenticate('user-local', {session: false}, (err, user, info) => {
                        // console.log("---UserController---")
                        // console.log("err", err)
                        // console.log("user", user)
                        // console.log("info", info)
                        if (err || !user) {
                            reject(err);
                        }
                        req.login(user, {session: false}, (err) => {
                            if (err) {
                                throw(err);
                            }
                            // console.log(user)
                            // console.log(user)
                            // generate a signed son web token with the contents of user object and return it in the response
                            const token = jwt.sign({...user, type: 'user'}, process.env.SECRETJWT);
                            resolve(token);
                        });
                    })({body: args}, res);
                })
            } catch (e) {
                throw(e);
            }
        }
    },
    Mutation: {
        addUser: async (parent, args, context) => {
            // email dupe is checked
            // if (!context.user) {
            //     throw new AuthenticationError("authentication failed");
            // }
            // args.password = await bcrpyt.hash(args.password, 12)
            const newUser = new user(args)
            return newUser.save()
        },
        editUser: async (parent, args, context) => {
            //if id is incorrect then return null, email dupe is checked
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            // args.password = await bcrpyt.hash(args.password, 12)
            // console.log(args);
            return user.findOneAndUpdate({_id: args.id}, args, {new: true});
        },
        changePasswordUser: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            // console.log(args)
            args.password = await bcrpyt.hash(args.password, 12);
            return user.findOneAndUpdate({_id: args.id}, args, {new: true});
        },
        deleteUser: async (parent, args, context) => {
            //no check if the id is correct or not just delete and always return null
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            try {
                // console.log("deleteUser", args.id)
                await book.findOneAndUpdate({borrowedBy: args.id}, {borrowedBy: null});
                return user.findOneAndDelete({_id: ObjectId(args.id)});
            } catch (e) {
                return false;
            }

        },
    },
    Book: {
        borrowedBy(parent) {
            // console.log("user", parent);
            return (
                user
                    .findById(parent.borrowedBy)
            );
        }
    }
}