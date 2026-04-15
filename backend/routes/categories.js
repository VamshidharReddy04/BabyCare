const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
