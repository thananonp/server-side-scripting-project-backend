"use strict";
const { gql } = require("apollo-server");

const authorSchema = gql`
  extend type Query {
    author(id: ID!): Author
    authors(limit: Int, skip: Int): [Author]
    countAuthor: Int
  }

  extend type Mutation {
    addAuthor(name: String!, biography: String!, file: Upload!): Author
    editAuthor(id: ID!, name: String!, biography: String!, file: Upload): Author
    deleteAuthor(id: ID!): Author
  }

  type Author {
    id: ID
    name: String
    biography: String
    imageUrl: String
  }
`;

module.exports = authorSchema;
