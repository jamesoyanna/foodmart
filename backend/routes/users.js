const express = require('express');
const passport = require("passport");
const passportConfig = require("../passport");
const router = express.Router();

const {Register,   Login,  LoginUser, UpdatePasswordViaEmail } = require("../controllers/users");

router.post("/register",Register )
router.post("/login", passport.authenticate("local", { session: false }), Login)
router.post("/loginuser", passport.authenticate("local", { session: false }), LoginUser)
router.put("/updatePasswordViaEmail", UpdatePasswordViaEmail)

module.exports = router;