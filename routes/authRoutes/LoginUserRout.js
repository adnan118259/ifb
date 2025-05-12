// routes/routes.js
const express = require("express");
const { LoginUser } = require("../../query/auth/login");

const router = express.Router();

 
router.post("/login", LoginUser);

module.exports = router;