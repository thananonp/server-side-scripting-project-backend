const {gql} = require('apollo-server-express')
const authorSchema = require('./authorSchema')
const bookSchema = require('./bookSchema')
const categorySchema = require('./categorySchema')
const publisherSchema = require('./publisherSchema')
const staffSchema = require('./staffSchema')
const userSchema = require('./userSchema')
const preferenceSchema = require('./preferenceSchema')

const linkSchema = gql`
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
        url:String!
    }
`;

module.exports = [linkSchema, userSchema, bookSchema, categorySchema
    , authorSchema, publisherSchema, staffSchema,preferenceSchema]