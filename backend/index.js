require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
