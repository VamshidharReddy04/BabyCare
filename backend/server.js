// server.js — BabyCare MERN Backend
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "https://baby-care-swart.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/products", require("./routes/products"));
app.use("/api/users", require("./routes/users"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/categories", require("./routes/categories"));

// Root route for direct browser access.
app.get("/", (_, res) => {
  res.json({
    message: "BabyCare API is running",
    health: "/api/health",
  });
});

// Health check
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", service: "BabyCare API" }),
);

// ── DB + Start ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
