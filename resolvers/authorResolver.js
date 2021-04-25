const author = require('../models/authorModel')
const {AuthenticationError} = require("apollo-server-errors");
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path')
const fs = require('fs')
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
            if(!mimetype.toString().startsWith("image/")){
                console.log("Not Picture")
                throw new Error("Wrong file type")
            }else{
                const stream = createReadStream()
                const newPath = `../public/images/${generateRandomName+filename}`
                const pathName = path.join(__dirname,newPath)
                await stream.pipe(fs.createWriteStream(pathName))
                console.log(newPath)
                // console.log(args.file.createReadStream())
                args.imageUrl = newPath
                const newAuthor = new author(args)
                return newAuthor.save()}
        },
        editAuthor: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("authentication failed");
            }
            return author.findOneAndUpdate({_id: args.id}, args, {new: true})
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