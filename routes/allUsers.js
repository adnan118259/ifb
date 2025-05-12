// routes/routes.js
const express = require("express");
const { AllUsers } = require("../query/allUsers");

const router = express.Router();

 
router.get("/users", AllUsers);

module.exports = router;
