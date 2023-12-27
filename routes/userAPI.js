const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

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
        let user = await User.find({ email: email });
        console.log(user);
        if (user && user.length > 0) {
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
        return res.send(`User created.`);
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
    }

    res.send({ errors: result.array() });
  }
);

module.exports = router;
