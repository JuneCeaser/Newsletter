const express = require("express");
const {
  createNewsletter,
  getNewsletters,
  deleteNewsletter,
} = require("../controllers/newsletterController");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("image"), createNewsletter);
router.get("/", authMiddleware, getNewsletters);
router.delete("/:id", authMiddleware, deleteNewsletter);

module.exports = router;
