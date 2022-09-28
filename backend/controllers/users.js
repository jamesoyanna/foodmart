const crypto = require("crypto");
const bcrypt = require("bcrypt");
const passport = require("passport");
const JWT = require("jsonwebtoken");

const Users = require("../models/users.model");

//const {WEBSITE_URL}
require("dotenv").config();

const BCRYPT_SALT_ROUNDS = 10;

// const nodemailer = require('nodemailer');

// const signToken = (userID) => {
//     return JWT.sign(
//     {
//         iss: process.env.PASSPORTJS_KEY,
//         sub: userID,
//     },
//     process.env.PASSPORTJS_KEY,
//     {expiresIn: "30 days" }
//     )
// };

// Register a User
const Register = async (req, res) => {
  const { username, password, name, surname, prefix, phone } = req.body;

  await Users.findOne({ username }).then((user) => {
    if (user)
      res.status(201).json({
        message: "E-mail is already taken",
        error: true,
      });
    else {
      new Users({
        username,
        password,
        name,
        surname,
        prefix,
        phone,
        isCustomer: true,
        created_user: { name: "register" },
      }).save((err) => {
        if (err)
          res.status(500).json({
            message: "Error has occured " + err,
            error: true,
          });
        else
          res.status(201).json({
            message: "Account successfully created",
            error: false,
          });
      });
    }
  });
};

module.exports = {
  Register,
};
