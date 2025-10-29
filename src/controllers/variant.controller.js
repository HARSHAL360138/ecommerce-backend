// const Variant = require("../models/variant.model");

// // Create a new variant
// exports.createVariant = async (req, res) => {
//   try {
//     const variant = new Variant(req.body);
//     const savedVariant = await variant.save();
//     res.status(201).json(savedVariant);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Get all variants
// exports.getAllVariants = async (req, res) => {
//   try {
//     const variants = await Variant.find().populate("product");
//     res.status(200).json(variants);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get variant by ID
// exports.getVariantById = async (req, res) => {
//   try {
//     const variant = await Variant.findById(req.params.id).populate("product");
//     if (!variant) return res.status(404).json({ error: "Variant not found" });
//     res.status(200).json(variant);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update variant by ID
// exports.updateVariant = async (req, res) => {
//   try {
//     const updatedVariant = await Variant.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedVariant) return res.status(404).json({ error: "Variant not found" });
//     res.status(200).json(updatedVariant);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete variant by ID
// exports.deleteVariant = async (req, res) => {
//   try {
//     const deletedVariant = await Variant.findByIdAndDelete(req.params.id);
//     if (!deletedVariant) return res.status(404).json({ error: "Variant not found" });
//     res.status(200).json({ message: "Variant deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };












const Variant = require("../models/variant.model");
const Product = require("../models/product.model");

// Create a new variant
exports.createVariant = async (req, res) => {
  try {
    const variant = new Variant(req.body);
    const savedVariant = await variant.save();

    // ✅ Add variant ID to product.variants array
    await Product.findByIdAndUpdate(
      savedVariant.product,
      { $push: { variants: savedVariant._id } },
      { new: true }
    );

    res.status(201).json(savedVariant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all variants
exports.getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.find().populate("product");
    res.status(200).json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get variant by ID
exports.getVariantById = async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id).populate("product");
    if (!variant) return res.status(404).json({ error: "Variant not found" });
    res.status(200).json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update variant by ID
exports.updateVariant = async (req, res) => {
  try {
    const updatedVariant = await Variant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVariant)
      return res.status(404).json({ error: "Variant not found" });

    // ✅ Ensure the variant is still linked to the correct product
    await Product.findByIdAndUpdate(
      updatedVariant.product,
      { $addToSet: { variants: updatedVariant._id } },
      { new: true }
    );

    res.status(200).json(updatedVariant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete variant by ID
exports.deleteVariant = async (req, res) => {
  try {
    const deletedVariant = await Variant.findByIdAndDelete(req.params.id);
    if (!deletedVariant)
      return res.status(404).json({ error: "Variant not found" });

    // ✅ Remove deleted variant from product.variants array
    await Product.findByIdAndUpdate(
      deletedVariant.product,
      { $pull: { variants: deletedVariant._id } }
    );

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
