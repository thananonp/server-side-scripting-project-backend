# Library Management Backend

### Author

###### schema

###### query

###### mutation

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
    imageUrl: String # to the image hosting URL at Firebase Storage Bucket
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

* Search book

only specify one argument: title, publisher or author

return book that have matching regular expression of that type

```graphql
query Books($id:ID){
    books (title : $id)
    #or books (author : $id) 
    #or books (category : $id) 
}
```

###### mutation

* Add a new book

Add a new book to the database. Require staff authentication. Must include a picture for the book with the images/*
format.

```graphql
mutation{
    addBook(
        title: String!
        category: ID!
        author: ID!
        publisher: ID!
        dateOfPublication: String!
        pageCount: Int!
        description: String!
        file: Upload!
    ): Book
}
```

* Edit a book

Edit a book. Require every argument except file.

If file is specify the new image is uploaded and created.

If no file is provided the old picture will be used.

```graphql
mutation{
    editBook(
        id: ID!
        title: String!
        category: ID!
        author: ID!
        publisher: ID!
        dateOfPublication: String!
        pageCount: Int!
        description: String!
        file: Upload
    ):Book
}
```

* Borrow a book

Link the book to the user that borrows the book.

Return true if success, false if failed.

```graphql
mutation {
    updateBookBorrow(
        id:ID!, #ID of the book
        borrowedBy:ID! #ID of the user
    ):Boolean
}
```

* Return a book

Unlink the book and user entity.

Return true if success, false if failed.

```graphql
mutation {
    clearBookBorrow(
        id:ID!, #ID of the book
    ):Boolean
}
```

* Delete a book

Return the book entity

```graphql
mutation {
    deleteBook(
        id:ID! #ID of the book
    ):Book
}
```

### Author

###### schema

```graphql
 type Author{
    id: ID
    name: String
    biography: String
    imageUrl: String
}
```

###### query

* Get a single author

Input parameter is ID, return a Author

```graphql
query {
    author(id:ID!): Author
}
```

* Get all author

```graphql
query {
authors: [Author]
}
```

###### mutation

* Add a new author

```graphql
mutation {
    addAuthor(
        name: String!
        biography: String!
        file: Upload!
    ): Author
}
```

* Edit an author

Require a staff authentication.

file is optional, if given the new picture is saved, else it will use the old picture.

```graphql
mutation {
    editAuthor(
        id:ID!
        name: String!
        biography: String!
        file: Upload
    ): Author
}
```

* Delete an author

```graphql
mutation {
    deleteAuthor(
        id:ID!
    ):Author
}
```