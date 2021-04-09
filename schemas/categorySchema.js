const {gql} = require('apollo-server');

const categorySchema = gql`
    extend type Query {
        category: [Category]
    }

    extend type Mutation {
        addCategory(
            title: String
        ): Category,
        editCategory(
            id:ID
            title: String
        ): Category,
        deleteCategory(
            id:ID
        ):Category
    }

    type Category{
        id:ID
        title: String
    }

    input CategoryInput{
        title: String
    }
`

module.exports = categorySchema