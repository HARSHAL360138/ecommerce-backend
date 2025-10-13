const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model"); // assuming you have a Product model

// 🟢 GET USER WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });

    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products.product");

    if (!wishlist) {
      return res.status(200).json({ message: "Wishlist is empty", wishlist: [] });
    }

    res.status(200).json({ message: "Wishlist fetched successfully", wishlist: wishlist.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟢 ADD PRODUCT TO WISHLIST
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [{ product: productId }] });
    } else {
      // Prevent duplicates
      const exists = wishlist.products.some(p => p.product.toString() === productId);
      if (exists) return res.status(400).json({ message: "Product already in wishlist" });

      wishlist.products.push({ product: productId });
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist: wishlist.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔴 REMOVE PRODUCT FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(p => p.product.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist: wishlist.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔴 CLEAR WISHLIST
exports.clearWishlist = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });

    await Wishlist.findOneAndUpdate({ user: req.user.id }, { products: [] });
    res.status(200).json({ message: "Wishlist cleared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
