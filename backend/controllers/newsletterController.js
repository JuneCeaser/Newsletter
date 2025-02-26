const Newsletter = require("../models/Newsletter");
const mongoose = require("mongoose");

const createNewsletter = async (req, res) => {
  try {
    const { id, subject, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newNewsletter = new Newsletter({
      _id: id,
      subject,
      description,
      imageUrl,
    });

    await newNewsletter.save();
    res
      .status(201)
      .json({ message: "Newsletter created successfully", newNewsletter });
  } catch (error) {
    res.status(500).json({ message: "Error creating newsletter", error });
  }
};

const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(newsletters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching newsletters", error });
  }
};

const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNewsletter = await Newsletter.findByIdAndDelete(id);

    if (!deletedNewsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createNewsletter, getNewsletters, deleteNewsletter };
