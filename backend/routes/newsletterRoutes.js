const express = require("express");
const {
  createNewsletter,
  getNewsletters,
  deleteNewsletter,
  updateNewsletter,
} = require("../controllers/newsletterController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), createNewsletter);
router.get("/", getNewsletters);
router.delete("/:id", deleteNewsletter);

module.exports = router;
