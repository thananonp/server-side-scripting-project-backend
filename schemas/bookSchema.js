const {gql} = require('apollo-server');

const bookSchema = gql`
    extend type Query {
        book(id: ID!): Book
        books(limit: String): [Book]
    }
    extend type Mutation {
        addBook(
            title: String
            category: ID!
            author: ID!
            publisher: ID!
            dateOfPublication: String
            pageCount: Int
            description: String
        ): Book,
        editBook(
            id: ID
            title: String
            category: ID!
            author: ID!
            publisher: ID!
            dateOfPublication: String
            pageCount: Int
            description: String
        ):Book,
        updateBookBorrow(
            id:ID!,
            borrowedBy:ID!
        ):Book,
        clearBookBorrow(
            id:ID!
        ):Book,
        deleteBook(
            id:ID
        ):Book
    }

    type Book{
        id: ID
        title: String
        category: Category
        author: Author
        publisher: Publisher
        dateOfPublication: String
        pageCount: Int
        description: String
        borrowedBy: User
    }

`;

module.exports = bookSchema
