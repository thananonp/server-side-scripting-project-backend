const {gql} = require('apollo-server');

const bookSchema = gql`
    extend type Query {
        book(id: ID!): Book
        books(limit: String): [Book]
    }
    extend type Mutation {
        addBook(
            title: String
            category: CategoryInput
            author: AuthorInput
            publisher: PublisherInput
            dateOfPublication: String
            pageCount: Int
            description: String
        ): Book,
        editBook(
            id: ID
            title: String
            category: CategoryInput
            author: AuthorInput
            publisher: PublisherInput
            dateOfPublication: String
            pageCount: Int
            description: String
        ):Book,
        updateBookBorrow(
            id:ID
        ):Book,
        deleteBook(
            id:ID
        ):Book
    }

    type Book{
        isbn: ID!
        title: String
        category: Category
        author: Author
        publisher: Publisher
        dateOfPublication: String
        pageCount: Int
        description: String
        borrowedBy: Staff
    }

`;

module.exports = bookSchema
