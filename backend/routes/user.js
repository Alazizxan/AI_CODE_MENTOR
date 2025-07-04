const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const Course = require("../models/Course");


// 🏆 Barcha foydalanuvchilarni ball bo‘yicha tartiblash
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .select("username points level") // faqat kerakli maydonlar
      .sort({ points: -1 }); // ball bo‘yicha kamayish tartibida
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Leaderboardni olishda xatolik" });
  }
});


router.put("/premium/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    user.premium = true;
    await user.save();

    res.json({ message: "✅ Premiumga o‘tkazildi", user });
  } catch (err) {
    console.error("❌ Premiumga o‘tkazishda xatolik:", err);
    res.status(500).json({ error: "Server xatoligi" });
  }
});



// 🧑‍🎓 Foydalanuvchi ma'lumotlari
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User topilmadi" });

    // ✅ completedTasks asosida kurslarni to‘plash
    const courseIds = [
      ...new Set(user.completedTasks.map((t) => t.courseId.toString())),
    ];

    const courses = await Course.find({ _id: { $in: courseIds } });

    const coursesWithProgress = courses.map((course) => {
      const completed = user.completedTasks.filter(
        (t) => t.courseId.toString() === course._id.toString()
      ).length;

      return {
        _id: course._id,
        title: course.title,
        level: course.level,
        totalTasks: course.tasks.length,
        completedTasks: completed, // ✅ nechtasi bajarilgan
      };
    });

    // 🏅 Top foydalanuvchilar
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(5)
      .select("username points");

    res.json({
      _id: user._id,
      username: user.username,
      level: user.level,
      points: user.points,
      courses: coursesWithProgress,
      topUsers,
    });
  } catch (err) {
    console.error("❌ User ma’lumotini olishda xatolik:", err);
    res.status(500).json({ error: "Server xatosi" });
  }
});



module.exports = router;
