const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {verifySignUp} = require("../middlewares")
// Create a user Router
// POST http://localhost:5000/api/v1/auth/singup
router.post("/signup",[verifySignUp.checkDuplicateUsernameOrEmail],[verifySignUp.checkRolesExisted], authController.signup);

router.post("/signin",authController.signin)

module.exports = router;