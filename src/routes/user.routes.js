const express = require("express");
const router = express.Router();
const authController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/user.middleware");
const { signUpValidation, loginValidation } = require("../middlewares/user.validators");

////////////////////////////////////////////////////////////////////////////////

//login routes
router.post("/signup", signUpValidation, authController.signup);
router.post("/login", loginValidation, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware, authController.logout);
router.get("/profile", authMiddleware, authController.profile);


// Profile routes
router.post("/create-profile", authMiddleware, authController.createProfile);
router.get("/get-profile", authMiddleware, authController.getProfile);
router.put("/edit-profile", authMiddleware, authController.editProfile);
router.delete("/delete-profile", authMiddleware, authController.deleteProfile);


//delete user and profile data
router.delete("/delete-account", authMiddleware, authController.deleteAccount);

////////////////////////////////////////////////////////////////////////////////

module.exports = router;
