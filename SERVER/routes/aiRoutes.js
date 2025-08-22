const express = require("express");
const router = express.Router();
const {createFunnyChat} = require("../controllers/AiController.js");

router.post("/ai", createFunnyChat);

module.exports = router;