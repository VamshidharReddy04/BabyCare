const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { keyword, category, page = 1, limit = 8 } = req.query;
    const filter = {};

    if (keyword) filter.name = { $regex: keyword, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/top", async (_req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
