const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// 🟢 GET USER CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }
    res.status(200).json({ message: "Cart fetched successfully", cart: cart.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟢 ADD PRODUCT TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [{ product: productId, quantity }] });
    } else {
      const existingProduct = cart.products.find(p => p.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity; // Increase quantity
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart: cart.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟡 UPDATE PRODUCT QUANTITY
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.find(p => p.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart: cart.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔴 REMOVE PRODUCT FROM CART
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart: cart.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔴 CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { products: [] });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
