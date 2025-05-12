// routes/routes.js
const express = require("express");
const { checkEmail } = require("../../query/auth/checkEmail");

const router = express.Router();

router.post("/checkemail", checkEmail);

module.exports = router;
