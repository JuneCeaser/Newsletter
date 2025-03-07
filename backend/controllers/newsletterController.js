const Newsletter = require("../models/Newsletter");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new newsletter
const createNewsletter = async (req, res) => {
  try {
    const { id, subject, description } = req.body;

    // Upload image to Cloudinary if file exists
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;

      // Remove temp file
      fs.unlinkSync(req.file.path);
    }

    // Create new newsletter with custom ID
    const newsletter = new Newsletter({
      _id: id,
      subject,
      description,
      imageUrl,
    });

    await newsletter.save();
    res.status(201).json(newsletter);
  } catch (error) {
    console.error("Error creating newsletter:", error);
    res
      .status(500)
      .json({ message: "Error creating newsletter", error: error.message });
  }
};

// Get all newsletters
const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(newsletters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching newsletters", error: error.message });
  }
};

// Delete a newsletter
const deleteNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    // Delete image from Cloudinary if exists
    if (newsletter.imageUrl) {
      const publicId = newsletter.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Newsletter.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting newsletter", error: error.message });
  }
};

module.exports = { createNewsletter, getNewsletters, deleteNewsletter };
