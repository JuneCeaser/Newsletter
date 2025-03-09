const Newsletter = require("../models/Newsletter");
const User = require("../models/User");
const sendEmail = require("../config/nodemailer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const createNewsletter = async (req, res) => {
  try {
    const { subject, description } = req.body;

    // Upload image to Cloudinary if file exists
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "newsletters",
      });
      imageUrl = result.secure_url;
    }

    // Create a new newsletter (MongoDB will auto-generate the _id)
    const newNewsletter = new Newsletter({
      subject,
      description,
      imageUrl,
    });

    // Save the newsletter to the database
    await newNewsletter.save();

    // Fetch all users' emails
    const users = await User.find({}, "email");

    // Prepare the email content
    const emailContent = `
      <h1>${subject}</h1>
      <p>${description}</p>
      ${
        imageUrl
          ? `<img src="${imageUrl}" alt="Newsletter Image" style="max-width: 100%;" />`
          : ""
      }
    `;

    // Send the newsletter to all users
    const emailPromises = users.map((user) =>
      sendEmail(user.email, subject, emailContent)
    );

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // Respond with success message
    res.status(201).json({
      message: "Newsletter created and sent successfully",
      newNewsletter,
    });
  } catch (error) {
    console.error("Error creating newsletter:", error);
    res.status(500).json({
      message: "Error creating newsletter",
      error: error.message,
    });
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
