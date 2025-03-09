const nodemailer = require("nodemailer");

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail or any other service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send an email
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Recipient address
      subject, // Subject line
      html, // HTML body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
