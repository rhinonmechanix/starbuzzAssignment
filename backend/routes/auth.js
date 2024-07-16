const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Counter = require("../models/Counter");
require("dotenv").config();

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Get the next user_id
    const counter = await Counter.findByIdAndUpdate(
      { _id: "user_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Create new user
    user = new User({
      user_id: counter.seq,
      username,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        user_id: user.user_id,
        username: user.username,
      },
    };

    // Sign JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        user_id: user.user_id,
        username: user.username,
      },
    };

    // Sign JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
