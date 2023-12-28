const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authorization");
const User = require("../models/User");
const config = require("../config/keys");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find({ _id: req.user.id }).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error.message);
  }
});
router.post(
  "/",
  // Validations
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "PAssword is required").exists(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      try {
        const { email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid username or password" }] });
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid username or password" }] });
        }
        // JWT token
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: 3600 * 24 },
          (err, token) => {
            if (err) throw err;
            return res.status(200).json({ token: token });
          }
        );
        // return res.send(`User created.`);
      } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server error");
      }
    } else {
      return res.status(400).json({ errors: result.array() });
    }
  }
);
module.exports = router;
