"use strict";
const { gql } = require("apollo-server");

const bookSchema = gql`
  extend type Query {
    book(id: ID!): Book
    books(
      limit: Int
      skip: Int
      borrowed: Boolean
      category: ID
      author: ID
      publisher: ID
    ): [Book]
    countBook: Int
    countBookSearch(query: String, scope: String): Int
    searchBooks(query: String, scope: String, limit: Int, skip: Int): [Book]
  }
  extend type Mutation {
    addBook(
      title: String!
      category: ID!
      author: ID!
      publisher: ID!
      dateOfPublication: String!
      pageCount: Int!
      description: String!
      file: Upload!
    ): Book
    editBook(
      id: ID!
      title: String!
      category: ID!
      author: ID!
      publisher: ID!
      dateOfPublication: String!
      pageCount: Int!
      description: String!
      file: Upload
    ): Book
    updateBookBorrow(id: ID!, borrowedBy: ID!): Boolean
    clearBookBorrow(id: ID!): Boolean
    deleteBook(id: ID!): Book
  }

  type Book {
    id: ID
    title: String
    category: Category
    author: Author
    publisher: Publisher
    dateOfPublication: String
    pageCount: Int
    description: String
    borrowedBy: User
    dateOfBorrow: String
    imageUrl: String
  }
`;

module.exports = bookSchema;
