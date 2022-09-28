const crypto = require("crypto");
const bcrypt = require("bcrypt");
// const passport = require("passport");
const JWT = require("jsonwebtoken");

const Users = require("../models/users.model");

//const {WEBSITE_URL}
require("dotenv").config();

const BCRYPT_SALT_ROUNDS = 10;

 const nodemailer = require('nodemailer');

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

// Reset Password
const ResetPassword = (req, res) => {
  Users.findOne({
    resetPasswordToken: req.query.resetPasswordToken, 
    resetPasswordExpires: {$gt: Date.now()},
  }).then((user) => {
    if(user == null){
      console.log(error("password reset link is invalid or has expired"));
      res.status(403).send("password reset link is invalid or has expired");
    } else {
      res.status(200).send({
        username: user.name,
        message: "passwprd reset link a-ok"
      })
    }
  })
}

// Forgot Password
const ForgotPassword = (req, res) => {
  if (req.body.username === "") {
    res.status(400).send("email required");
  }

  Users.findOne({ username: req.body.username }).then((user) => {
    if (user === null) {
      res.send("email not in db");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      Users.updateOne(
        {
          username: req.body.username,
        },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        }
      )
        .then((res) => console.log(res + " added"))
        .catch((err) => console.log(err));

      const transporter = nodemailer.createTransport(maillerConfig);

      const mailOptions = {
        to: `${req.body.username}`,
        from: `${maillerConfig.auth.user}`,
        subject: "Link To Reset Password",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `${process.env.ADMIN_SITE}/resetpassword/?token=${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };

      console.log("sending mail password" + req.body.username);

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error("there was an error: ", err);
        } else {
          console.log("here is the res: ", response);
          res.status(200).json("recovery email sent");
        }
      });
    }
  });
};


  module.exports = {
    Register,
    Login,
    LoginUser,
    UpdatePasswordViaEmail,
    ResetPassword,
    ForgotPassword,
  };
