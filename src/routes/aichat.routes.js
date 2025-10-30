const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/aichat.controller");
const { validateChatRequest } = require("../middlewares/aichat.middleware");

// Chat endpoint
router.post("/chat", validateChatRequest, chatWithAI);

module.exports = router;
