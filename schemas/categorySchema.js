"use strict";
const { gql } = require("apollo-server");

const categorySchema = gql`
  extend type Query {
    category(id: ID!): Category
    categories(limit: Int, skip: Int): [Category]
    countCategory: Int
  }

  extend type Mutation {
    addCategory(title: String!, file: Upload!): Category
    editCategory(id: ID!, title: String!, file: Upload): Category
    deleteCategory(id: ID!): Category
  }

  type Category {
    id: ID
    title: String
    imageUrl: String
  }
`;

module.exports = categorySchema;
