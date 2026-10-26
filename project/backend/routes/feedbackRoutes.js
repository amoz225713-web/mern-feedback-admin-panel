const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();

// Read all feedback
router.get("/", async (req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ message: "Unable to load feedback" });
  }
});

// Add feedback
router.post("/", async (req, res) => {
  try {
    const item = await Feedback.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update feedback
router.put("/:id", async (req, res) => {
  try {
    const item = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
  try {
    const item = await Feedback.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;