const express = require("express");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add a new comment to a post
router.post("/:post_id", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const post_id = req.params.post_id;

  try {
    const comment = new Comment({
      post_id,
      author: req.user.user_id.toString(),
      content,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all comments for a post
router.get("/:post_id", async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const comments = await Comment.find({ post_id });
    res.json(comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
