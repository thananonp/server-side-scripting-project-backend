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
    token: String
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

limit: limit the number of document returned by the databases.

skip: skip n number of document from the first document.

```graphql
query{
    users(borrowed: Boolean, limit: Int, skip: Int): [User]
}
```

* Check if the password of the user is correct: Boolean

compare the password with the user of that id

```graphql
query{
    userComparePassword(id:ID!,password:String!)
}
```

* Login the user using the email and password

Return the user's token.

```graphql
query {
    userLogin(email: String!, password: String!): String
}
```

* Count the total number of users in the databases

```graphql
query {
    countUser: Int
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

limit: limit the number of document returned by the databases.

skip: skip n number of document from the first document.

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

* Login the staff using email and password

Return a staff's JWT token

```graphql
query {
    staffLogin(email: String!, password: String!): String

}
```

* Count the number of staff in the database

```graphql
query {
    countStaff: Int
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

limit: limit the number of document returned by the databases.

skip: skip n number of document from the first document.

**only put one parameter at a time**

```graphql
query {
    books(
        limit: Int
        skip: Int
        borrowed: Boolean
        category: ID
        author: ID
        publisher: ID
    ): [Book]
}
```

* Count the total number of book in the database

```graphql
query {countBook: Int}
```

* Count the number of book in the search query

query: the search query of the user

scope: 'title','author','publisher'

return the number of book that have matching regular expression of that type

```graphql
query{countBookSearch(query: String, scope: String): Int}
```

* Search book

only specify one argument: title, publisher or author

query: the search query of the user

scope: 'title','author','publisher'

limit: limit the number of document returned by the databases.

skip: skip n number of document from the first document.

return book that have matching regular expression of that type

```graphql
query {
    searchBooks(query: String, scope: String, limit: Int, skip: Int): [Book]

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

limit: limit the number of document returned by the databases.

skip: skip n number of document from the first document.

```graphql
query {
    authors(limit: Int, skip: Int): [Author]
}
```

* Get the number of all authors in the database

Return a number

```graphql
query {
    countAuthor: Int
}
```

###### mutation

* Add a new author

Require a staff authentication.

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

Require a staff authentication.

```graphql
mutation {
    deleteAuthor(
        id:ID!
    ):Author
}
```

### Category

###### schema

```graphql
type Category{
    id:ID
    title: String
    imageUrl: String
}
```

###### query

* Get a single category

Input parameter is ID, return a category

```graphql
query {
    category(id:ID!): Category
}
```

* Get all category

limit: limit the number of document returned by the databases.

skip: skip n number of document from the first document.

```graphql
query {
    categories(limit: Int, skip: Int): [Category]
}
```

* Get the number of all categories in the database

Return a number

```graphql
query {
    countCategory: Int
}
```

###### mutation

* Add a new category

Require a staff authentication.

```graphql
mutation {
    addCategory(
        title: String!
        file: Upload!
    ): Category
}
```

* Edit a category

Require a staff authentication.

file is optional, if given the new picture is saved, else it will use the old picture.

```graphql
mutation {
    editCategory(
        id:ID!
        title: String!
        file: Upload
    ): Category
}
```

* Delete a category

Require a staff authentication.

```graphql
mutation {
    deleteCategory(
        id:ID!
    ):Category
}
```

### Preference

###### schema

This preference collection should only have a single document in it.

The only way to create this document is through programmatically way only.

```graphql
type Preference{
    id: ID
    fineRate: Int # How much a user should be fine for a day of late return.
    borrowableDay: Int # How long can a user borrow a book for.
}
```

###### query

Get the preference. ID is not needed because there will only be one preference document in the database.

```graphql
query {
    preference: Preference
}
```

###### mutation

* Edit a preference

Required staff authentication.

There is a validator for min and max in both front and backend.

```graphql
mutation {
    editPreference(
        id:ID!
        fineRate: Int
        borrowableDay: Int
    ): Preference
}
```

### Publisher

###### schema

```graphql
type Publisher {
    id: ID
    name: String
    description: String
    imageUrl: String
}
```

###### query

* Get a single publisher

Input parameter is ID, return a publisher

```graphql
query {
    publisher(id: ID!): Publisher
}
```

* Get all publishers

limit: limit the number of document returned by the databases.

skip: skip n number of document from the first document.

```graphql
query {
    publishers(limit: Int, skip: Int): [Publisher]
}
```

* Get the number of all publishers in the database

Return a number

```graphql
query {
    countPublisher: Int}
```

###### mutation

* Add a new publisher

Require a staff authentication.

```graphql
mutation {
    addPublisher(name: String!, description: String!, file: Upload!): Publisher
}
```

* Edit a publisher

Require a staff authentication.

file is optional, if given the new picture is saved, else it will use the old picture.

```graphql
mutation {
    editPublisher(
        id: ID!
        name: String!
        description: String!
        file: Upload
    ): Publisher
}
```

* Delete a publisher

Require a staff authentication.

```graphql
mutation {
    deletePublisher(id: ID!): Publisher
}
```
