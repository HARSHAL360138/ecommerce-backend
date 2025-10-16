const express = require("express");
const router = express.Router();
const variantController = require("../controllers/variant.controller");

// CRUD Routes
router.post("/", variantController.createVariant);       // Create
router.get("/", variantController.getAllVariants);       // Read all
router.get("/:id", variantController.getVariantById);    // Read one
router.put("/:id", variantController.updateVariant);     // Update
router.delete("/:id", variantController.deleteVariant);  // Delete

module.exports = router;
