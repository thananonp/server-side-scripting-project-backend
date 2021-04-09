const {gql} = require('apollo-server-express')
const authorSchema = require('./authorSchema')
const bookSchema = require('./bookSchema')
const categorySchema = require('./categorySchema')
const publisherSchema = require('./publisherSchema')
const staffSchema = require('./staffSchema')
const userSchema = require('./userSchema')

const linkSchema = gql`
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
`;

module.exports = [linkSchema, userSchema, bookSchema, categorySchema
    , authorSchema, publisherSchema, staffSchema]