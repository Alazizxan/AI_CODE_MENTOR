const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const aiEvaluator = require("../utils/aiEvaluator");

const router = express.Router();

// Middleware: Token verification
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token kerak" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token yaroqsiz" });
  }
};

// GET /api/course/list
router.get("/list", authMiddleware, async (req, res) => {
  const courses = [
    { level: 1, title: "Hello World", description: "Dastlabki Hello World" },
    { level: 2, title: "If-Else", description: "Shart operatorlari" },
    { level: 3, title: "For Loop", description: "Takrorlash operatorlari" },
  ];
  res.json({ courses });
});

// POST /api/course/submit/:level
router.post("/submit/:level", authMiddleware, async (req, res) => {
  const { code } = req.body;
  const user = await User.findById(req.userId);

  const result = aiEvaluator(code, req.params.level);

  if (result.correct) {
    if (user.progress < req.params.level) {
      user.progress = req.params.level;
      await user.save();
    }
  }

  res.json({
    feedback: result.feedback,
    nextLevelUnlocked: result.correct,
  });
});

module.exports = router;
