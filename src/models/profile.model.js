const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phone: String,
    gender: String,
    dateOfBirth: Date,
    profileImage: String,
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", profileSchema);
