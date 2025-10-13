const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// CRUD routes
router.post("/", productController.createProduct);           // Create
router.get("/", productController.getAllProducts);          // Get all
router.get("/:id", productController.getProductById);       // Get single
router.put("/:id", productController.updateProduct);        // Update
router.delete("/:id", productController.deleteProduct);     // Delete

module.exports = router;
