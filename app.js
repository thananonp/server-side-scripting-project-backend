"use strict";
//Library import
const mongoose = require("mongoose");
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { ApolloServer } = require("apollo-server-express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
//File import
const resolvers = require("./resolvers/index.js");
const schemas = require("./schemas/index.js");
const { checkAuth } = require("./utils/function.js");
//Initialization
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
const corsOptions = {
  // origin: 'http://localhost:8001',
  origin: "https://sssf-frontend.web.app/",
  credentials: true, // <-- REQUIRED backend setting
};
// app.use(cors(corsOptions));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

(async () => {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected successfully");

    const server = new ApolloServer({
      typeDefs: schemas,
      resolvers,
      context: async ({ req, res }) => {
        if (req) {
          const user = await checkAuth(req, res);
          // const user = true
          return { req, res, user };
        }
      },
    });

    server.applyMiddleware({ app });

    process.env.NODE_ENV = process.env.NODE_ENV || "development";
    if (process.env.NODE_ENV === "production") {
      const production = require("./sec/production");
      production(app, 3000);
    } else {
      const localhost = require("./sec/localhost");
      localhost(app, 8000, 3000);
    }

    app.use(
      helmet({
        contentSecurityPolicy: false,
        ieNoOpen: false,
      })
    );

    app.get("/", (req, res) => {
      res.send("Hello Secure World!");
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.sendStatus(404);
    });
  } catch (e) {
    console.log("server error: " + e.message);
  }
})();

module.exports = app;
