// const express = require("express");
// const router = express.Router();
// const buyNowController = require("../controllers/buynow.controller");

// // POST: Create Buy Now order
// router.post("/", buyNowController.createBuyNowOrder);

// // GET: All Buy Now orders for a user
// router.get("/user/:userId", buyNowController.getUserBuyNowOrders);

// // GET: Single Buy Now order by ID
// router.get("/:id", buyNowController.getBuyNowOrderById);

// // PUT: Update order status
// router.put("/:id/status", buyNowController.updateBuyNowOrderStatus);

// // DELETE: Delete a Buy Now order
// router.delete("/:id", buyNowController.deleteBuyNowOrder);

// module.exports = router;






const express = require("express");
const router = express.Router();
const buyNowController = require("../controllers/buynow.controller");

// POST: Create Buy Now order (auto stock deduction)
router.post("/", buyNowController.createBuyNowOrder);

// GET: All Buy Now orders for a user
router.get("/user/:userId", buyNowController.getUserBuyNowOrders);

// GET: Single Buy Now order
router.get("/:id", buyNowController.getBuyNowOrderById);

// PUT: Update order status
router.put("/:id/status", buyNowController.updateBuyNowOrderStatus);

// DELETE: Delete Buy Now order (restocks if not delivered)
router.delete("/:id", buyNowController.deleteBuyNowOrder);

module.exports = router;
