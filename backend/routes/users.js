const express = require('express');
const passport = require("passport");
const passportConfig = require("../passport");
const router = express.Router(); 

const {Register,   Login,  LoginUser, UpdatePasswordViaEmail, ResetPassword,Authenticated, AuthenticatedUser, ForgotPassword, Logout, Admin } = require("../controllers/users");

router.post("/register",Register )
router.post("/login", passport.authenticate("local", { session: false }), Login)
router.post("/loginuser", passport.authenticate("local", { session: false }), LoginUser)
router.put("/updatePasswordViaEmail", UpdatePasswordViaEmail)
router.get("/reset", ResetPassword)
router.post("/forgotPassword", ForgotPassword)
router.get("/logout", Logout)
router.get("/admin", passport.authenticate("jwt", {session: false}), Admin)
router.get("/authenticateduser", passport.authenticate("jwt", {session: false}), AuthenticatedUser)
router.get("/authenticated", passport.authenticate("jwt", {session: false}), Authenticated)

module.exports = router;