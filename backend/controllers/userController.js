const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username email").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

module.exports = { getAllUsers };
