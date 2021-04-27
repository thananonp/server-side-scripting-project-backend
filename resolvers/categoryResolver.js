const category = require('../models/categoryModel')
const {deletePicture} = require("../utils/firebaseInit");
const {uploadPicture} = require("../utils/firebaseInit");
const ObjectId = require('mongoose').Types.ObjectId;
const {AuthenticationError} = require("apollo-server-errors");

module.exports = {
    Query: {
        category: (parent, args) => {
            console.log(args.id)
            return category
                .findById(args.id)

        },
        categories: (parent, args) => {
            return category
                .find()
        }
    },
    Mutation: {
        addCategory: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            const {createReadStream, filename, mimetype, encoding} = await args.file
            args.imageUrl = await uploadPicture(createReadStream, filename, mimetype, encoding)
            const newCategory = new category(args)
            return newCategory.save()
        },
        editCategory: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            if (args.file) {
                const {createReadStream, filename, mimetype, encoding} = await args.file
                args.imageUrl = await uploadPicture(createReadStream, filename, mimetype, encoding)
                return category.findOneAndUpdate({_id: ObjectId(args.id)}, args, {new: true})
            } else {
                return category.findOneAndUpdate({_id: ObjectId(args.id)}, args, {new: true})
            }
        },
        deleteCategory: async (parent, args, context) => {
            if (context.user.type !== 'staff') {
                throw new AuthenticationError("authentication failed");
            }
            return category.findOneAndDelete({_id: ObjectId(args.id)}).then(
                (data)=>{
                    // console.log(data)
                    deletePicture(data.imageUrl)
                }
            )
        },
    },
    Book: {
        category(parent) {
            console.log("category",parent)
            return (
                category
                    .findById(parent.category)
            )
        }
    }
}