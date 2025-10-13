const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// 🟢 PLACE ORDER (from cart)
exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Prepare order products
    const orderProducts = cart.products.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Create order
    const order = new Order({
      user: req.user.id,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Pending"
    });

    await order.save();

    // Clear cart after placing order
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟢 GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.product");
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟢 GET SINGLE ORDER
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🟡 UPDATE ORDER STATUS (admin or user if allowed)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔴 CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
