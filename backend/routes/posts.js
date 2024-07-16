const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new post
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = new Post({
      title,
      content,
      author: req.user.user_id.toString(), // Convert user_id to string
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single post by ID with comments
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post_id: req.params.id });

    res.json({
      ...post.toObject(),
      comments: comments.length > 0 ? comments : [],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a post by ID
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author !== req.user.user_id.toString()) {
      return res.status(403).json({ message: "User not authorized" });
    }
    post.title = title;
    post.content = content;
    post.updated_at = Date.now();
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a post by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author !== req.user.user_id.toString()) {
      return res.status(403).json({ message: "User not authorized" });
    }
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: "Post removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
