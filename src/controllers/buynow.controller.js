// const BuyNow = require("../models/buynow.model");
// const Product = require("../models/product.model");

// /**
//  * @desc Create a new Buy Now order
//  * @route POST /api/buynow
//  */
// exports.createBuyNowOrder = async (req, res) => {
//   try {
//     const { productId, quantity = 1, shippingAddress, paymentMethod } = req.body;
//     const userId = req.user?._id || req.body.userId; // works for both authenticated and manual testing

//     // Validate product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Calculate price and total
//     const price = product.basePrice || product.mrp || 0;
//     const totalAmount = price * quantity;

//     // Create buy now record
//     const buyNowOrder = new BuyNow({
//       user: userId,
//       product: productId,
//       quantity,
//       price,
//       totalAmount,
//       shippingAddress,
//       paymentMethod,
//     });

//     await buyNowOrder.save();

//     res.status(201).json({
//       message: "Buy Now order created successfully",
//       buyNowOrder,
//     });
//   } catch (error) {
//     console.error("Error creating Buy Now order:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * @desc Get all Buy Now orders for a user
//  * @route GET /api/buynow/user/:userId
//  */
// exports.getUserBuyNowOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const orders = await BuyNow.find({ user: userId })
//       .populate("product")
//       .sort({ createdAt: -1 });

//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching Buy Now orders:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * @desc Get a single Buy Now order by ID
//  * @route GET /api/buynow/:id
//  */
// exports.getBuyNowOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await BuyNow.findById(id).populate("product user");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Error fetching Buy Now order:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * @desc Update Buy Now order status
//  * @route PUT /api/buynow/:id/status
//  */
// exports.updateBuyNowOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const order = await BuyNow.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({
//       message: "Order status updated successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * @desc Delete a Buy Now order
//  * @route DELETE /api/buynow/:id
//  */
// exports.deleteBuyNowOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await BuyNow.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({ message: "Order deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting Buy Now order:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

















const BuyNow = require("../models/buynow.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

/**
 * @desc Create a new Buy Now order (auto stock deduction + order creation)
 * @route POST /api/buynow
 */
exports.createBuyNowOrder = async (req, res) => {
  try {
    const { productId, quantity = 1, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?._id || req.body.userId;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Calculate pricing
    const price = product.basePrice || product.mrp || 0;
    const totalAmount = price * quantity;

    // Deduct stock
    product.stock -= quantity;
    await product.save();

    // Create a BuyNow record
    const buyNowOrder = new BuyNow({
      user: userId,
      product: productId,
      quantity,
      price,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Processing",
    });
    await buyNowOrder.save();

    // Create a corresponding Order entry (for order tracking/history)
    const order = new Order({
      user: userId,
      products: [{ product: productId, quantity, price }],
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Processing",
    });
    await order.save();

    res.status(201).json({
      message: "Buy Now order placed successfully",
      buyNowOrder,
      order,
    });
  } catch (error) {
    console.error("Error creating Buy Now order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all Buy Now orders for a user
 * @route GET /api/buynow/user/:userId
 */
exports.getUserBuyNowOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await BuyNow.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching Buy Now orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get single Buy Now order by ID
 * @route GET /api/buynow/:id
 */
exports.getBuyNowOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await BuyNow.findById(id).populate("product user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching Buy Now order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update Buy Now order status
 * @route PUT /api/buynow/:id/status
 */
exports.updateBuyNowOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await BuyNow.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Also update the corresponding Order entry if it exists
    await Order.findOneAndUpdate(
      { "products.product": order.product, user: order.user },
      { status }
    );

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete a Buy Now order
 * @route DELETE /api/buynow/:id
 */
exports.deleteBuyNowOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await BuyNow.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optionally, restock product when deleted (if not delivered)
    if (deletedOrder.status !== "Delivered") {
      await Product.findByIdAndUpdate(deletedOrder.product, {
        $inc: { stock: deletedOrder.quantity },
      });
    }

    res.status(200).json({ message: "Order deleted and stock restored (if applicable)" });
  } catch (error) {
    console.error("Error deleting Buy Now order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
