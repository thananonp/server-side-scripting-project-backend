const {gql} = require('apollo-server');

const userSchema = gql`

    extend type Query {
        user(id: ID!): User
        users(borrowed: Boolean): [User]
        userComparePassword(id:ID!,password:String!): Boolean
    }

    extend type Mutation {
        addUser(
            email: String!,
            firstName: String!,
            lastName: String!,
            password: String!
        ): User,
        editUser(
            id: ID!,
            email: String,
            firstName: String,
            lastName: String
        ): User,
        changePasswordUser(
            id:ID!,
            password:String!
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
