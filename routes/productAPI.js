const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");

// Create Product
router.post(
  "/",
  [
    auth,
    [
      body("name", "Name is required").not().isEmpty(),
      body("description", "Description is required").not().isEmpty(),
      body("category", "Category is required").not().isEmpty(),
      body("price", "Price is required").not().isEmpty(),
      body("quantity", "Quantity is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const { name, description, category, price, brand, quantity } = req.body;
      const newProduct = new Product({
        userId: req.user.id,
        name,
        description,
        category,
        price,
        brand,
        quantity,
      });
      const product = await newProduct.save();
      res.json({ product });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

//  Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//  Get Single Products
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ msg: "Product was not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
