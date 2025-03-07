const express = require("express");
const {
  createNewsletter,
  getNewsletters,
  deleteNewsletter,
} = require("../controllers/newsletterController");
const multer = require("multer");
const router = express.Router();

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
});

// Create uploads directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Routes without JWT authentication
router.post("/", upload.single("image"), createNewsletter);
router.get("/", getNewsletters);
router.delete("/:id", deleteNewsletter);

module.exports = router;
