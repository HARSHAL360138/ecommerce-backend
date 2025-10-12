const express = require("express");
const router = express.Router();
const authController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/user.middleware");
const { signUpValidation, loginValidation } = require("../middlewares/user.validators");

router.post("/signup", signUpValidation, authController.signup);
router.post("/login", loginValidation, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware, authController.logout);
router.get("/profile", authMiddleware, authController.profile);

module.exports = router;
