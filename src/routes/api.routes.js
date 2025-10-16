const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const productRouter = require("./product.routes");
const variantRouter = require("./variant.routes");
const reviewRouter = require("./review.routes");
const commentRouter = require("./comment.routes");
const wishlistRouter = require("./wishlist.routes");
const cartRouter = require("./cart.routes");
const orderRouter = require("./order.routes");

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/variant", variantRouter);
router.use("/review", reviewRouter);
router.use("/comment", commentRouter);
router.use("/wishlist", wishlistRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);

module.exports = router;
