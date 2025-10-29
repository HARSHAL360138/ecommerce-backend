const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const { authMiddleware } = require("../middlewares/user.middleware");

// Get user's wishlist
router.get("/", authMiddleware, wishlistController.getWishlist);

// Add product to wishlist
router.post("/add", authMiddleware, wishlistController.addToWishlist);

// Remove product from wishlist
router.post("/remove", authMiddleware, wishlistController.removeFromWishlist);

// Clear wishlist
router.delete("/clear", authMiddleware, wishlistController.clearWishlist);

// ✅ Add new wishlist count route
router.get("/count", authMiddleware, wishlistController.getWishlistCount);

module.exports = router;