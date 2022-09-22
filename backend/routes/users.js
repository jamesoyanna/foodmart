const express = require('express');
const passport = require("passport");
const router = express.Router();

const {Register,   Login,  LoginUser, } = require("../controllers/users");

router.post("/register",Register )
router.post("/login", passport.authenticate("local", { session: false }), Login)
router.post("/loginuser", passport.authenticate("local", { session: false }), LoginUser)

module.exports = router;