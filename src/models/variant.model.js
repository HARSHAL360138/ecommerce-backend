const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String },
    size: { type: String },
    material: { type: String },
    price: { type: Number },
    stock: { type: Number },
    images: [{ type: String }] // Variant-specific images
  },
  { timestamps: true }
);

module.exports = mongoose.model("Variant", variantSchema);
