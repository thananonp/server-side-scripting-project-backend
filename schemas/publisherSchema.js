const {gql} = require('apollo-server');

const publisherSchema = gql`
    extend type Query {
        publisher(id:ID!): Publisher
        publishers: [Publisher]
    }

    extend type Mutation {
        addPublisher(
            name: String!
            description: String!
        ): Publisher,
        editPublisher(
            id:ID!
            name: String!
            description: String!
        ): Publisher,
        deletePublisher(
            id:ID!
        ):Publisher
    }

    type Publisher{
        id: ID
        name: String
        description: String
    }

    input PublisherInput{
        name: String
        description: String
    }

`;

module.exports = publisherSchema
