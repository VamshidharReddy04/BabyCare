const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();
const DEFAULT_ADMIN = {
  name: "Admin",
  email: "admin@babycare.com",
  password: "admin",
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "babysecret", {
    expiresIn: "30d",
  });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginId = (identifier || email || "").trim();

    if (!loginId || !password) {
      return res
        .status(400)
        .json({ message: "Email/username and password required" });
    }

    const loginLower = loginId.toLowerCase();

    // Ensure the requested default admin credentials always have an admin account to sign in.
    if (
      password === DEFAULT_ADMIN.password &&
      (loginLower === DEFAULT_ADMIN.name.toLowerCase() ||
        loginLower === DEFAULT_ADMIN.email.toLowerCase())
    ) {
      let adminUser = await User.findOne({ email: DEFAULT_ADMIN.email });

      if (!adminUser) {
        adminUser = await User.create({
          name: DEFAULT_ADMIN.name,
          email: DEFAULT_ADMIN.email,
          password: DEFAULT_ADMIN.password,
          isAdmin: true,
        });
      }

      if (!adminUser.isAdmin) {
        adminUser.isAdmin = true;
        await adminUser.save();
      }

      return res.json({
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
        token: generateToken(adminUser._id),
      });
    }

    const user = await User.findOne({
      $or: [
        { email: loginLower },
        { name: { $regex: `^${escapeRegex(loginId)}$`, $options: "i" } },
      ],
    });

    if (user && user.isBanned) {
      return res
        .status(403)
        .json({ message: "Account is banned. Contact support." });
    }

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json(user);
});

router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Not found" });

    const { name, email, phone, password, address = {} } = req.body;

    if (email && email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (typeof phone === "string") user.phone = phone;

    user.address = {
      street: address.street ?? user.address?.street,
      city: address.city ?? user.address?.city,
      state: address.state ?? user.address?.state,
      pincode: address.pincode ?? user.address?.pincode,
      country: address.country ?? user.address?.country ?? "India",
    };

    if (password) {
      user.password = password;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", protect, admin, async (_req, res) => {
  try {
    const users = await User.find({})
      .select("name email phone isAdmin isBanned createdAt")
      .sort("-createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/ban", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot ban admin user" });
    }

    user.isBanned = Boolean(req.body.isBanned);
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
