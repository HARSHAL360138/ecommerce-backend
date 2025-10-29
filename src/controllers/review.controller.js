// const Review = require("../models/review.model");

// // Create a new review
// exports.createReview = async (req, res) => {
//   try {
//     const review = new Review(req.body);
//     const savedReview = await review.save();
//     res.status(201).json(savedReview);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Get all reviews
// exports.getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find()
//       .populate("product")
//       .populate("user", "name email"); // Optional: only fetch user name & email
//     res.status(200).json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get review by ID
// exports.getReviewById = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id)
//       .populate("product")
//       .populate("user", "name email");
//     if (!review) return res.status(404).json({ error: "Review not found" });
//     res.status(200).json(review);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update review by ID
// exports.updateReview = async (req, res) => {
//   try {
//     const updatedReview = await Review.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedReview) return res.status(404).json({ error: "Review not found" });
//     res.status(200).json(updatedReview);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete review by ID
// exports.deleteReview = async (req, res) => {
//   try {
//     const deletedReview = await Review.findByIdAndDelete(req.params.id);
//     if (!deletedReview) return res.status(404).json({ error: "Review not found" });
//     res.status(200).json({ message: "Review deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all reviews for a specific product
// exports.getReviewsByProduct = async (req, res) => {
//   try {
//     const reviews = await Review.find({ product: req.params.productId })
//       .populate("user", "name email");
//     res.status(200).json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



















const Review = require("../models/review.model");
const Product = require("../models/product.model");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();

    // ✅ Add review ID to the corresponding product's reviews array
    await Product.findByIdAndUpdate(
      savedReview.product,
      { $push: { reviews: savedReview._id } },
      { new: true }
    );

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product")
      .populate("user", "name email"); // Optional: only fetch user name & email
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("product")
      .populate("user", "name email");
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update review by ID
exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReview) return res.status(404).json({ error: "Review not found" });

    // ✅ Ensure product still has this review in case product changed
    await Product.findByIdAndUpdate(
      updatedReview.product,
      { $addToSet: { reviews: updatedReview._id } },
      { new: true }
    );

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete review by ID
exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ error: "Review not found" });

    // ✅ Remove review ID from product's reviews array
    await Product.findByIdAndUpdate(
      deletedReview.product,
      { $pull: { reviews: deletedReview._id } }
    );

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
