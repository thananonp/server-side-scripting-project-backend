const author = require('../models/authorModel')
const {AuthenticationError} = require("apollo-server-errors");
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path')
const fs = require('fs')
const {uploadPictureToFirebaseBucket} = require("../utils/firebase");
const {bucket} = require("../utils/firebase");
const {generateRandomName} = require("../utils/function");

module.exports = {
    Query: {
        author: (parent, args) => {
            return author.findById(args.id)
        },
        authors: (parent, args) => {
            return author
                .find()
        }
    },
    Mutation: {
        addAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            console.log(args)
            const {createReadStream, filename, mimetype, encoding} = await args.file
            if (!mimetype.toString().startsWith("image/")) {
                console.log("Not Picture")
                throw new Error("Wrong file type")
            } else {
                let publicUrl
                const randomFileName = filename + generateRandomName
                const blob = bucket.file(randomFileName);
                return await createReadStream()
                    .pipe(blob.createWriteStream({
                        metadata: {
                            contentType: mimetype,
                        },
                    })).on('error', err => {
                        console.log(err)
                    }).on('finish', async function () {
                        publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
                        console.log(publicUrl)
                        args.imageUrl = publicUrl
                        const newAuthor = new author(args)
                        return await newAuthor.save()
                    })
            }
        },
        editAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            console.log("editAuthor", args)
            if (args.file !== null) {
                const {createReadStream, filename, mimetype, encoding} = await args.file
                if (!mimetype.toString().startsWith("image/")) {
                    console.log("Not Picture")
                    throw new Error("Wrong file type")
                } else {
                    let publicUrl
                    const randomFileName = filename + generateRandomName
                    const blob = bucket.file(randomFileName);
                    return await createReadStream()
                        .pipe(blob.createWriteStream({
                            metadata: {
                                contentType: mimetype,
                            },
                        })).on('error', err => {
                            console.log(err)
                        }).on('finish', async function () {
                            publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
                            console.log(publicUrl)
                            args.imageUrl = publicUrl
                            return author.findOneAndUpdate({_id: args.id}, args, {new: true})
                        })
                }
            } else {
                return author.findOneAndUpdate({_id: args.id}, args, {new: true})
            }
        },
        deleteAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return author.findOneAndDelete({_id: ObjectId(args.id)})
        },
    },
    Book: {
        author(parent) {
            console.log("author", parent)
            return (
                author
                    .findById(parent.author)
            )
        }
    }
}