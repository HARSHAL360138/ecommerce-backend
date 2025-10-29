// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     brand: { type: String },
//     model: { type: String },
//     description: { type: String, default: "" },
//     basePrice: { type: Number, required: true },
//     mrp: { type: Number },
//     discountPercentage: { type: Number, default: 0 },
//     currency: { type: String, default: "INR" },
//     availability: { type: String, default: "In Stock" },
//     category: { type: String, default: "General" },
//     warranty: {
//       type: { type: String },
//       duration: { type: String }
//     },
//     shipping: {
//       weight: { type: String },
//       dimensions: {
//         length: { type: Number },
//         width: { type: Number },
//         height: { type: Number },
//         unit: { type: String, default: "cm" }
//       },
//       deliveryTime: { type: String },
//       returnPolicy: { type: String },
//       shippingCharge: { type: Number, default: 0 }
//     },
//     stock: { type: Number, default: 0 }, // Stock quantity
//     isMain: { type: Boolean, default: false }, // Featured product flag
//     variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
//     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
//     share: {
//       shareUrl: { type: String },
//       totalShares: { type: Number, default: 0 },
//       platformShares: {
//         whatsapp: { type: Number, default: 0 },
//         facebook: { type: Number, default: 0 },
//         instagram: { type: Number, default: 0 },
//         twitter: { type: Number, default: 0 },
//         linkedin: { type: Number, default: 0 },
//         other: { type: Number, default: 0 }
//       }
//     },
//     views: { type: Number, default: 0 },
//     images: [{ type: String }],
//     videos: [{ type: String }]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);












// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     brand: { type: String },
//     model: { type: String },
//     description: { type: String, default: "" },
//     basePrice: { type: Number, required: true },
//     mrp: { type: Number },
//     discountPercentage: { type: Number, default: 0 },
//     currency: { type: String, default: "INR" },
//     availability: { type: String, default: "In Stock" },
//     category: { type: String, default: "General" },
//     subCategory: { type: String, default: "" }, // Added subCategory
//     subSubCategory: { type: String, default: "" }, // Added subSubCategory
//     warranty: {
//       type: { type: String },
//       duration: { type: String }
//     },
//     shipping: {
//       weight: { type: String },
//       dimensions: {
//         length: { type: Number },
//         width: { type: Number },
//         height: { type: Number },
//         unit: { type: String, default: "cm" }
//       },
//       deliveryTime: { type: String },
//       returnPolicy: { type: String },
//       shippingCharge: { type: Number, default: 0 }
//     },
//     stock: { type: Number, default: 0 }, // Stock quantity
//     isMain: { type: Boolean, default: false }, // Featured product flag
//     variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
//     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
//     share: {
//       shareUrl: { type: String },
//       totalShares: { type: Number, default: 0 },
//       platformShares: {
//         whatsapp: { type: Number, default: 0 },
//         facebook: { type: Number, default: 0 },
//         instagram: { type: Number, default: 0 },
//         twitter: { type: Number, default: 0 },
//         linkedin: { type: Number, default: 0 },
//         other: { type: Number, default: 0 }
//       }
//     },
//     views: { type: Number, default: 0 },
//     images: [{ type: String }],
//     videos: [{ type: String }]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);
















const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    model: { type: String },
    description: { type: String, default: "" },
    basePrice: { type: Number, required: true },
    mrp: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    availability: { type: String, default: "In Stock" },
    category: { type: String, default: "General" },
    subCategory: { type: String, default: "" }, // Added subCategory
    subSubCategory: { type: String, default: "" }, // Added subSubCategory
    sizes: [{ type: String }], // 🆕 Added sizes field for clothing (e.g., S, M, L, XL)
    warranty: {
      type: { type: String },
      duration: { type: String }
    },
    shipping: {
      weight: { type: String },
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        unit: { type: String, default: "cm" }
      },
      deliveryTime: { type: String },
      returnPolicy: { type: String },
      shippingCharge: { type: Number, default: 0 }
    },
    stock: { type: Number, default: 0 }, // Stock quantity
    isMain: { type: Boolean, default: false }, // Featured product flag
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    share: {
      shareUrl: { type: String },
      totalShares: { type: Number, default: 0 },
      platformShares: {
        whatsapp: { type: Number, default: 0 },
        facebook: { type: Number, default: 0 },
        instagram: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        linkedin: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
      }
    },
    views: { type: Number, default: 0 },
    images: [{ type: String }],
    videos: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
