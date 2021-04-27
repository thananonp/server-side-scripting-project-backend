const publisher = require('../models/publisherModel')
const {bucket} = require("../utils/firebase");
const {generateRandomName} = require("../utils/function");
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        publisher: (parent, args) => {
            return publisher
                .findById(args.id)
        },
        publishers: (parent, args) => {
            return publisher
                .find()
        }
    },
    Mutation: {
        addPublisher: async (parent, args, context) => {
            console.log("context",context)
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
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
                        const newPublisher = new publisher(args)
                        return newPublisher.save()
                    })
            }
        },
        editPublisher: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            return publisher.findOneAndUpdate({_id: args.id}, args, {new: true})
        },
        deletePublisher: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            return publisher.findOneAndDelete({_id: args.id})
        },
    },
    Book: {
        publisher(parent) {
            console.log("publisher", parent)
            return (
                publisher
                    .findById(parent.publisher)
            )
        }
    }
}