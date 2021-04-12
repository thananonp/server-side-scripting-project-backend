const {gql} = require('apollo-server');

const userSchema = gql`

    extend type Query {
        user(id: ID!): User
        users: [Staff]
    }

    extend type Mutation {
        addUser(
            email: String
            firstName: String
            lastName: String
            password: String
        ): User,
        editUser(
            id: ID!,
            email: String
            firstName: String
            lastName: String
            password: String
        ): User,
        deleteUser(
            id:ID!
        ): User
    }

    type User{
        id: ID
        email: String
        firstName: String
        lastName: String
        password: String
        currentlyBorrowed: Book
    }
`;

module.exports = userSchema
