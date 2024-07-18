const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Create a user Router
// POST http://localhost:5000/api/v1/auth/singup
router.post("/singup", authController.singup);

router.post("/signin",authController.signin)

module.exports = router;