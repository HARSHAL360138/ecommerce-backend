const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// CRUD
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

// Extra features
router.patch("/:id/set-main", productController.setMainProduct);
router.patch("/:id/share", productController.incrementShare);

// Optional route to manually test stock update
router.patch("/:id/update-stock", async (req, res) => {
  try {
    const { quantity, action } = req.body;
    const product = await productController.updateStock(req.params.id, quantity, action);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
