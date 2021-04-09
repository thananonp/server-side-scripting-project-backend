const {ApolloServer, gql} = require('apollo-server');

const authorSchema = gql`
    extend type Query {
        author(id:ID!): Author
        authors: [Author]
    }

    extend type Mutation {
        addAuthor(
            name: String!
            biography: String
        ): Author,
        editAuthor(
            id:ID!
            name: String
            biography: String
        ): Author,
        deleteAuthor(
            id:ID!
        ):Author
    }

    type Author{
        id: ID
        name: String
        biography: String
    }

    input AuthorInput{
        name: String
        biography: String
    }

`;

module.exports = authorSchema
