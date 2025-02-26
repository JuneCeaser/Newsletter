const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
