const express = require("express");
const LoginRegister = require("../Controllers/register-login");
const router = express.Router();

router.post("/login", LoginRegister.UserLogin);

router.post("/signup", LoginRegister.UserRegister);

module.exports = router;
