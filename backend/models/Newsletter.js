const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

const newsletterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
