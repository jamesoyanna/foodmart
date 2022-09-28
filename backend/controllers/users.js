const crypto = require("crypto");
const bcrypt = require("bcrypt");
const passport = require("passport");
const JWT = require("jsonwebtoken");

const Users = require("../models/users.model");

//const {WEBSITE_URL}
require("dotenv").config();

const BCRYPT_SALT_ROUNDS = 10;

// const nodemailer = require('nodemailer');

const signToken = (userID) => {
    return JWT.sign(
    {
        iss: process.env.PASSPORTJS_KEY,
        sub: userID,
    },
    process.env.PASSPORTJS_KEY,
    {expiresIn: "30 days" }
    )
};

// Login a User
const LoginUser = (req, res) => {
if(isAuthenticated()) {
  const {username, _id, name, surname, company, isCustomer, address, image, isActive, prefix, phone} = req.user;
  const token = signToken(_id);
  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: true,
  });
  res.status(200).json({
    isAuthenticated: true,
    user: {
      username, 
      id: _id,
      name: name,
      surname,
      company,
      isCustomer,
      image,
      address,
      isActive,
      prefix,
      phone,
    },
  });
}
}

// Login user
const Login = (req, res) => {
  if(erq.isAuthenticated()){
    const {_id, username, role, name, company, isCustomer, image, phone} = req.user;
    const token = signToken(_id);
    res.cookie("access_token", token, {httpOnly: true, sameSite: true})
    res.status(200).json({
      isAuthenticated: true,
      user: {
        username,
        role,
        id: _id,
        name: name + " " + surnname,
        company: company,
        isCustomer: isCustomer,
        image: image,
        phone: phone,
      }
    })
  }
}

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

<<<<<<< HEAD
  module.exports = {
    Register,
    Login,
    LoginUser,
  };
=======
module.exports = {
  Register,
};
>>>>>>> master
