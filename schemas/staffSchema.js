const {gql} = require('apollo-server');

const userSchema = gql`

    extend type Query {
        staff(id: ID!): Staff
        staffs: [User]
    }

    extend type Mutation {
        addStaff(
            email: String
            firstName: String
            lastName: String
            password: String
        ): Staff,
        editStaff(
            id: ID,
            email: String
            firstName: String
            lastName: String
            password: String
        ): Staff,
        deleteStaff(
            id:ID
        ): Staff
    }

    type Staff{
        id: ID
        email: String
        firstName: String
        lastName: String
        password: String
    }
`;

module.exports = userSchema
