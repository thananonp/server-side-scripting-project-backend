# Library Management Backend

[Frontend Repo](https://github.com/thananonp/server-side-scripting-project-backend)

[Endpoint of deployed backend](https://thananonp-test.jelastic.metropolia.fi/) `https://thananonp-test.jelastic.metropolia.fi/`

## Description

### Feature

* User
    * can find book, author, publisher and category of books in the library. So they don't have to physically visit the
      library.
    * View the borrowed book's return date and fine.
* Staff
    * can add, edit, remove the data about book, author, publisher and category of books in the library.
    * They can also manage the user by using the system.
    * The number of fine rate per day and the number of the days the book can be borrowed can both be modified in the
      system.
* Book can be borrowed and returned through the system. And, the data will appear in the website.
* Registration, login, edit personal information and password of user and staff.
* Backend authentication by user type.

### Libraries

This project is created using NodeJS. Some libraries include

* apollo, apollo-express
* bcrypt
* crypto
* express
* firebase
* graphql
* helmet
* mongoose, mongodb
* passport
* dotenv

### System design

The management system is divided into 2 entities.

1. User
2. Staff

Both of which has its own authentication and database.

The databases contain records such as author, book, publisher and category.

## Project structure

1. Controller

Allow access the mongoose object.

2. Model

Contain the schema for mongoose.

3. Resolver

Resolve GraphQL query and mutation.

4. Schema

Contain GraphQL query, mutation and type.

5. sec

Build the HTTP and HTTPS server based on the production variable.

6. utils

Contain the utility and helper function.

7. app.js

is the start JavaScript file.

### .env file

* URI = mongodb cloud server uri
* SECRETJWT = 'your jwt secret here'
* NODE_EVN = production ; for production environment only

## Installation

Make sure you have NodeJS installed on your system.

1. Clone or download this repository.
2. Run `npm install`
3. Run `npm start`
4. The backend should be running on HTTPS at port 3000.

## Usage and documentation

Please refer to [Documentation.md](Documentation.md)

## Roadmap

Please refer to [Trello Board](https://trello.com/b/sHWITl32/server-side-scripting-frameworks)

## Acknowledgment

Thank you for my hard work.

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Checklist

* Implement GraphQL API w/ authenticated mutations ✅
* NoSQL Database functionality (CRUD) ✅
* Users have to be able to interact with the app ✅
* can use WebSocket API (e.g. chat, real time game, push notification (for client to refresh the data,...),...) or
  WebRTC (real time voice and/or video) ❌ (My project does not use real time communication.)
* Publish your work in cloud service ✅
* For the frontend you can (but you don't have to) use React, Angular, Bootstrap, jQuery, Ionic, React Native etc... ✅
* In the user interface, elements / components have proper design / layout ✅
* Visual appearance of the app is appreciated  (so at least use Bootstrap etc.) ✅
* Application has to function properly :) ✅ (Maybe some bugs here and there but should function)
* Application has to be coded correctly (Waiting for strict mode and clean up)
    * correct code structuring (Waiting for refractors)
    * small enough, meaningful functions (Waiting for refractors)
    * proper variable & function naming (Waiting for refractors)
    * written with Ecmascript 6 in strict mode (Waiting for refractors)
* App shouldn't copy or imitate stuff provided in the exercises ✅
* Project source code in git ✅
    * at your convenience github ✅
    * .gitignore ✅
    * documentation (e.g. readme.md) ✅
    * Eventually: hook (deploy from source to server on git commit/push to master) ❓
    * Trello ✅ [Link](https://trello.com/b/sHWITl32/server-side-scripting-frameworks)
