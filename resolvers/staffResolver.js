"use strict";

const bcrpyt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-errors");
const staff = require("../models/staffModel.js");

module.exports = {
  Query: {
    staff: (parent, args) => {
      return staff.findById(args.id);
    },
    staffs: () => {
      return staff.find();
    },
    staffComparePassword: async (parent, args) => {
      // console.log("args.password", args.password)
      return await staff.findById(args.id).then((result) => {
        return bcrpyt.compare(args.password, result.password);
        // compareUser = result
      });
    },
    staffLogin: async (parent, args, { req, res }) => {
      try {
        return await new Promise((resolve, reject) => {
          passport.authenticate(
            "staff-local",
            { session: false },
            (err, user, info) => {
              // console.log("---StaffController---")
              // console.log("err", err)
              // console.log("user", user)
              // console.log("info", info)
              if (err || !user) {
                reject(err);
              }
              req.login(user, { session: false }, (err) => {
                if (err) {
                  throw err;
                }
                // console.log(user)
                // console.log(user)
                // generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign(
                  { ...user, type: "staff" },
                  process.env.SECRETJWT
                );
                resolve(token);
              });
            }
          )({ body: args }, res);
        });
      } catch (e) {
        throw e;
      }
    },
    countStaff: async () => {
      return staff.count();
    },
  },
  Mutation: {
    addStaff: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      // args.password = await bcrpyt.hash(args.password, 12)
      const newStaff = new staff(args);
      return newStaff.save();
    },
    editStaff: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      return staff.findOneAndUpdate({ _id: args.id }, args, { new: true });
    },
    changePasswordStaff: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }

      // console.log(args)
      args.password = await bcrpyt.hash(args.password, 12);
      return staff.findOneAndUpdate({ _id: args.id }, args, { new: true });
    },
    deleteStaff: async (parent, args, context) => {
      if (context.user.type !== "staff") {
        throw new AuthenticationError("authentication failed");
      }
      return staff.findOneAndDelete({ _id: ObjectId(args.id) });
    },
  },
};
