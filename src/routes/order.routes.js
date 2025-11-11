// const express = require("express");
// const router = express.Router();
// const orderController = require("../controllers/order.controller");
// const { authMiddleware } = require("../middlewares/user.middleware");

// // Place order
// router.post("/place", authMiddleware, orderController.placeOrder);

// // Get all orders of user
// router.get("/", authMiddleware, orderController.getUserOrders);

// // Get single order
// router.get("/:id", authMiddleware, orderController.getOrderById);

// // Update order status (optional, admin route)
// router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

// // Cancel order
// router.post("/:id/cancel", authMiddleware, orderController.cancelOrder);

// module.exports = router;











const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authMiddleware } = require("../middlewares/user.middleware");

// --------------------
// USER SIDE ROUTES
// --------------------

// Place order
router.post("/place", authMiddleware, orderController.placeOrder);

// Get all orders of user
router.get("/", authMiddleware, orderController.getUserOrders);

// Get single order
router.get("/:id", authMiddleware, orderController.getOrderById);

// Update order status (optional, admin route)
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

// Cancel order
router.post("/:id/cancel", authMiddleware, orderController.cancelOrder);

// ✅ User submits payment details (after scanning QR)
router.post("/:id/payment", authMiddleware, orderController.submitPaymentDetails);

// --------------------
// ADMIN SIDE ROUTES
// --------------------

// ✅ Admin gets all pending payments
router.get("/admin/payments/all", authMiddleware, orderController.getAllPendingPayments);

// ✅ Admin confirms a payment (marks as Success)
router.put("/admin/:id/confirm-payment", authMiddleware, orderController.confirmPayment);

module.exports = router;