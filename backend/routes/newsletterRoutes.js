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

// Email sending function
router.post("/send-newsletter", async (req, res) => {
  try {
    const { title, content } = req.body;

    // Fetch all subscriber emails
    const subscribers = await Subscriber.find({});
    const emailList = subscribers.map((subscriber) => subscriber.email);

    if (emailList.length === 0) {
      return res
        .status(400)
        .json({ message: "No subscribers to send emails to." });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList,
      subject: `Newsletter: ${title}`,
      html: `<h2>${title}</h2><p>${content}</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Newsletter sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending newsletter." });
  }
});

module.exports = router;
