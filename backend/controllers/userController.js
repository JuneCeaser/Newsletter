const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({}, { strict: false }),
  "users"
);

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = { getAllUsers, getUserById, deleteUserById };
