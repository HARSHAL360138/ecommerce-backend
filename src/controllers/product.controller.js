const Product = require("../models/product.model");

// 🟢 CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;

    const product = new Product({ name, description, price, stock, category, images });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

// 🟢 GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "Products fetched successfully", products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// 🟢 GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

// 🟡 UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

// 🔴 DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
