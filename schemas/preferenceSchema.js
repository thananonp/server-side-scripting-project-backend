const {ApolloServer, gql} = require('apollo-server');

const preferenceSchema = gql`
    extend type Query {
        preference: Preference
    }

    extend type Mutation {
        editPreference(
            id:ID!
            fineRate: Int
            borrowableDay: Int
        ): Preference
    }

    type Preference{
        id: ID
        fineRate: Int
        borrowableDay: Int
    }
`;

module.exports = preferenceSchema
