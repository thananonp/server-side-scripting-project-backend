"use strict";
const { gql } = require("apollo-server");

const publisherSchema = gql`
  extend type Query {
    publisher(id: ID!): Publisher
    publishers(limit: Int, skip: Int): [Publisher]
    countPublisher: Int
  }

  extend type Mutation {
    addPublisher(name: String!, description: String!, file: Upload!): Publisher
    editPublisher(
      id: ID!
      name: String!
      description: String!
      file: Upload
    ): Publisher
    deletePublisher(id: ID!): Publisher
  }

  type Publisher {
    id: ID
    name: String
    description: String
    imageUrl: String
  }
`;

module.exports = publisherSchema;
