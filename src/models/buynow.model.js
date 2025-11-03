// const mongoose = require("mongoose");

// const buyNowSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//     quantity: { type: Number, default: 1 },
//     price: { type: Number, required: true }, // price at the time of buy now action
//     totalAmount: { type: Number, required: true },
//     shippingAddress: {
//       street: String,
//       city: String,
//       state: String,
//       postalCode: String,
//       country: String,
//     },
//     paymentMethod: { type: String, default: "COD" }, // e.g., COD, Card, PayPal
//     status: { 
//       type: String, 
//       enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
//       default: "Pending" 
//     },
//     orderDate: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("BuyNow", buyNowSchema);









const mongoose = require("mongoose");

const buyNowSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }, // price at the time of buy now action
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, default: "COD" }, // e.g., COD, Card, PayPal, QR
    transactionId: { type: String, default: null }, // user enters after payment
    amountPaid: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuyNow", buyNowSchema);
