# Library Management Backend
## Documentation

### User

###### schema

```graphql
type User{
    id: ID
    email: String
    firstName: String
    lastName: String
    password: String
    currentlyBorrowed: Book
}
```

###### query

* Get single user information: User

return user based on id

```graphql
query {user(id: ID!)}
```

* Get list of users information: [User]

borrowed == true : return list of users who borrowed a book.

borrowed == false : return list of users who has no borrowed book.

borrowed == null : returns list of all users.

```graphql
query{
    users (borrowed: false) {
        id
        email
        firstName
        lastName
    }
}
```

* Check if the password of the user is correct: Boolean

compare the password with the user of that id

```graphql
query{
    userComparePassword(id:ID!,password:String!)
}
```

###### mutation

* Add a new user: User

```graphql
mutation {
    addUser(
        email: String!,
        firstName: String!,
        lastName: String!,
        password: String!
    )}
```

* Edit user information (No password change): User

```graphql
mutation {
    editUser(
        id: ID!,
        email: String,
        firstName: String,
        lastName: String
    )}
```

* Change password of user: User

```graphql
mutation {
    changePasswordUser(
        id:ID!,
        password:String!
    )
}
```

* Delete user

```graphql
mutation {
    deleteUser(
        id:ID!
    )
}
```

### Staff

###### schema

```graphql
type Staff{
    id: ID
    email: String
    firstName: String
    lastName: String
    password: String
}
```

###### query

* Get single staff information: Staff

return staff based on id

```graphql
query {staff(id: ID!)}
```

* Get list of users information: [Staff]

```graphql
query{
    staffs{
        id
        email
        firstName
        lastName
    }
}
```

* Check if the password of the staff is correct: Boolean

compare the password with the staff of that id

```graphql
query{
    staffComparePassword(id:ID!,password:String!)
}
```

###### mutation

* Add a new staff: Staff

```graphql
mutation {
    addStaff(
        email: String!,
        firstName: String!,
        lastName: String!,
        password: String!
    )}
```

* Edit staff information (No password change): Staff

```graphql
mutation {
    editStaff(
        id: ID!,
        email: String,
        firstName: String,
        lastName: String
    )}
```

* Change password of staff: Staff

```graphql
mutation {
    changePasswordStaff(
        id:ID!,
        password:String!
    )
}
```

* Delete staff

```graphql
mutation {
    deleteStaff(
        id:ID!
    )
}
```

### Book

###### schema

```graphql
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
    dateOfBorrow : String
}
```

###### query

* Get single book information: Book

```graphql
query {
    book(id: ID!)
}
```

* Get list of books

limit: specify the number of returned result.

borrowed == true: return only borrowed books.

borrowed == false: return only available books.

borrowed == null: return all books.

category: return books by that category.

author: return books by that author.

publisher: return books by that publisher.

**only put one parameter at a time**

```graphql
query {
    books(limit: String, borrowed: Boolean, category: ID,author:ID, publisher:ID)
}
```





