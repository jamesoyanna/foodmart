const crypto = require("crypto");
const bcrypt = require("bcrypt");
// const passport = require("passport");
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
if(req.isAuthenticated()) {
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
  if(req.isAuthenticated()){
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

// Update Password Via email
const UpdatePasswordViaEmail = (req, res) => {
  Users.findOne({
    username: req.body.username,
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: { $gte: Date.now() },
  }).then((user) => {
    if (user == null) {
      //console.error({message:"password reset link is invalid or has expired"});
      res
        .status(200)
        .send({ message: "password reset link is invalid or has expired" });
    } else if (user != null) {
      bcrypt
        .hash(req.body.password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
          Users.findOneAndUpdate(
            {
              username: req.body.username,
            },
            {
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            }
          )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        })
        .then(() => {
          console.log("password updated");
          res.status(200).send({ message: "password updated" });
        });
    } else {
      res.status(200).send({ message: "no user exists in db to update" });
    }
  });
};


  module.exports = {
    Register,
    Login,
    LoginUser,
    UpdatePasswordViaEmail,
  };
