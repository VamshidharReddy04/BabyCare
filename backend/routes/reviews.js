const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const products = await Product.find({ "reviews.0": { $exists: true } })
      .select("name reviews")
      .limit(20);

    const flattened = [];
    for (const product of products) {
      for (const review of product.reviews) {
        flattened.push({
          productId: product._id,
          productName: product.name,
          review,
        });
      }
    }

    flattened.sort(
      (a, b) => new Date(b.review.createdAt) - new Date(a.review.createdAt),
    );
    res.json(flattened.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
