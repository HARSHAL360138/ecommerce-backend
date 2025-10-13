const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true } // price at time of order
      }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    paymentMethod: { type: String, default: "COD" }, // e.g., COD, Card, PayPal
    status: { 
      type: String, 
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
      default: "Pending" 
    },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
