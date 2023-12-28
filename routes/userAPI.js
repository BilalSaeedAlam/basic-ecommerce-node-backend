const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/keys");

router.get("/", (req, res) => res.send("User router"));

router.post(
  "/",
  // Validations
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Please pawword have at least 5 chracters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists." }] });
        }
        user = new User({
          name,
          email,
          password,
        });
        // Bcrypt Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.save();

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
