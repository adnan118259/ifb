// routes/routes.js
const express = require("express");
const { resendVerificationCode } = require("../../query/auth/resendVfc");

const router = express.Router();

router.post("/resendvfc", resendVerificationCode);

module.exports = router;
