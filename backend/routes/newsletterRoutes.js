const express = require("express");
const {
  createNewsletter,
  getNewsletters,
  deleteNewsletter,
} = require("../controllers/newsletterController");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("image"), createNewsletter);
router.get("/", getNewsletters);
router.delete("/:id", deleteNewsletter);

module.exports = router;
