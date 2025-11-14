// routes/admin.routes.js
const express = require("express");
const { loginAdmin } = require("../controllers/admin.controller");

const router = express.Router();

// Admin Login Route
router.post("/login", loginAdmin);

module.exports = router;