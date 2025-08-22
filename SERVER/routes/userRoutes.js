const express = require("express");
const { Login, Signup } = require("../controllers/userController.js");
const { userVerification } = require("../middlewares/Authmiddlewares.js");
const router = express.Router();

router.post("/login", Login);
router.post("/signup",Signup);
router.post("/video", userVerification);

module.exports = router;