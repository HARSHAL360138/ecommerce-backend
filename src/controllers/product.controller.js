const Product = require("../models/product.model");
require("../models/review.model");  // Ensure Review model is registered
require("../models/comment.model"); // Ensure Comment model is registered
require("../models/variant.model");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("variants")
      .populate("reviews")
      .populate("comments");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product by ID and increment views
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("variants")
      .populate("reviews")
      .populate("comments");
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark/unmark product as main
exports.setMainProduct = async (req, res) => {
  try {
    const { isMain } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isMain },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Increment share counts
exports.incrementShare = async (req, res) => {
  try {
    const { platform } = req.body; 
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.share.totalShares += 1;
    if (platform && product.share.platformShares.hasOwnProperty(platform)) {
      product.share.platformShares[platform] += 1;
    } else if (platform) {
      product.share.platformShares.other += 1;
    }

    await product.save();
    res.status(200).json(product.share);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update stock count based on order action
 * @param {String} productId - Product ID
 * @param {Number} quantity - Quantity affected
 * @param {String} action - 'book', 'cancelBooking', 'deliver', 'cancelOrder'
 */
exports.updateStock = async (productId, quantity, action) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    switch (action) {
      case "book":
      case "deliver":
        product.stock = (product.stock || 0) - quantity;
        break;

      case "cancelBooking":
      case "cancelOrder":
        product.stock = (product.stock || 0) + quantity;
        break;

      default:
        throw new Error("Invalid stock action");
    }

    if (product.stock < 0) product.stock = 0; 
    await product.save();
    return product;
  } catch (err) {
    throw err;
  }
};
