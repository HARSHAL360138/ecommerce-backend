const Newsletter = require("../models/newsletter.model");

// CREATE (Subscribe)
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSub = await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully", data: newSub });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// READ (Get all subscribers)
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UPDATE
exports.updateSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const updated = await Newsletter.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Subscriber not found" });

    res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE
exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Newsletter.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Subscriber not found" });

    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
