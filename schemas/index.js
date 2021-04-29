const {gql} = require('apollo-server-express');
const authorSchema = require('./authorSchema.js');
const bookSchema = require('./bookSchema.js');
const categorySchema = require('./categorySchema.js');
const publisherSchema = require('./publisherSchema.js');
const staffSchema = require('./staffSchema.js');
const userSchema = require('./userSchema.js');
const preferenceSchema = require('./preferenceSchema.js');

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

module.exports = [linkSchema, userSchema, bookSchema, categorySchema, authorSchema, publisherSchema, staffSchema, preferenceSchema];