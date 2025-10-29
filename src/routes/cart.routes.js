const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authMiddleware } = require("../middlewares/user.middleware");

// Get user cart
router.get("/", authMiddleware, cartController.getCart);

// Add product to cart
router.post("/add", authMiddleware, cartController.addToCart);

// Update product quantity
router.put("/update", authMiddleware, cartController.updateCartItem);

// Remove product from cart
router.post("/remove", authMiddleware, cartController.removeFromCart);

// Clear cart
router.delete("/clear", authMiddleware, cartController.clearCart);

router.get("/count", authMiddleware, cartController.getCartCount);

module.exports = router;
