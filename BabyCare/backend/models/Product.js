const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: [
        "Feeding",
        "Bath Time",
        "Toys",
        "Clothing",
        "Sleep",
        "Skincare",
        "Travel",
        "Learning",
      ],
    },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    images: [String],
    emoji: { type: String, default: "🍼" },
    tag: { type: String },
    stock: { type: Number, required: true, default: 0 },
    isOrganic: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    ageRange: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  if (this.reviews.length) {
    this.rating =
      this.reviews.reduce((sum, review) => sum + review.rating, 0) /
      this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
