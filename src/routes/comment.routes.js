const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

// CRUD routes
router.post("/", commentController.createComment);               // Create
router.get("/", commentController.getAllComments);               // Read all
router.get("/:id", commentController.getCommentById);            // Read one
router.put("/:id", commentController.updateComment);             // Update
router.delete("/:id", commentController.deleteComment);          // Delete

// Get all comments for a specific product
router.get("/product/:productId", commentController.getCommentsByProduct);

module.exports = router;
