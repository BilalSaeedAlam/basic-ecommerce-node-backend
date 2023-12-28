const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const User = require("../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find({ _id: req.user.id }).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
