// const Comment = require("../models/comment.model");

// // Create a new comment
// exports.createComment = async (req, res) => {
//   try {
//     const comment = new Comment(req.body);
//     const savedComment = await comment.save();
//     res.status(201).json(savedComment);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Get all comments
// exports.getAllComments = async (req, res) => {
//   try {
//     const comments = await Comment.find()
//       .populate("product")
//       .populate("user", "name email");
//     res.status(200).json(comments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get comment by ID
// exports.getCommentById = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id)
//       .populate("product")
//       .populate("user", "name email");
//     if (!comment) return res.status(404).json({ error: "Comment not found" });
//     res.status(200).json(comment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update comment by ID
// exports.updateComment = async (req, res) => {
//   try {
//     const updatedComment = await Comment.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedComment) return res.status(404).json({ error: "Comment not found" });
//     res.status(200).json(updatedComment);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete comment by ID
// exports.deleteComment = async (req, res) => {
//   try {
//     const deletedComment = await Comment.findByIdAndDelete(req.params.id);
//     if (!deletedComment) return res.status(404).json({ error: "Comment not found" });
//     res.status(200).json({ message: "Comment deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all comments for a specific product
// exports.getCommentsByProduct = async (req, res) => {
//   try {
//     const comments = await Comment.find({ product: req.params.productId })
//       .populate("user", "name email");
//     res.status(200).json(comments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };












const Comment = require("../models/comment.model");
const Product = require("../models/product.model");

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();

    // ✅ Add comment ID to the corresponding product's comments array
    await Product.findByIdAndUpdate(
      savedComment.product,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("product")
      .populate("user", "name email");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("product")
      .populate("user", "name email");
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update comment by ID
exports.updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedComment) return res.status(404).json({ error: "Comment not found" });

    // ✅ Ensure comment is linked to its product
    await Product.findByIdAndUpdate(
      updatedComment.product,
      { $addToSet: { comments: updatedComment._id } },
      { new: true }
    );

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) return res.status(404).json({ error: "Comment not found" });

    // ✅ Remove comment ID from product's comments array
    await Product.findByIdAndUpdate(
      deletedComment.product,
      { $pull: { comments: deletedComment._id } }
    );

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments for a specific product
exports.getCommentsByProduct = async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId })
      .populate("user", "name email");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
