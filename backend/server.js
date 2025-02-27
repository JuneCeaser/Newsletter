const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const newsletterRoutes = require("./routes/newsletterRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/newsletters", newsletterRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
