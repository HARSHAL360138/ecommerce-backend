const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// CRUD routes
router.post("/", reviewController.createReview);               // Create
router.get("/", reviewController.getAllReviews);               // Read all
router.get("/:id", reviewController.getReviewById);            // Read one
router.put("/:id", reviewController.updateReview);             // Update
router.delete("/:id", reviewController.deleteReview);          // Delete

// Get all reviews for a specific product
router.get("/product/:productId", reviewController.getReviewsByProduct);

module.exports = router;
