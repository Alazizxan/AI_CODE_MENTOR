const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const { aiEvaluateCode } = require("../utils/aiEvaluator");
const authMiddleware = require("../middleware/auth");

// 📚 Kurslar ro'yxatini olish
router.get("/list", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("❌ Kurslarni olishda xatolik:", err);
    res.status(500).json({ error: "Kurslarni olishda xatolik" });
  }
});

// 🆕 Kurs yaratish
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, level, tasks } = req.body;
    const course = new Course({ title, description, level, tasks });
    await course.save();
    res.status(201).json({ message: "✅ Kurs yaratildi", course });
  } catch (err) {
    console.error("❌ Kurs yaratishda xatolik:", err);
    res.status(500).json({ error: "Kurs yaratishda xatolik" });
  }
});

// 📝 Kursni tahrirlash
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, level, tasks } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, level, tasks },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });
    res.json({ message: "✅ Kurs yangilandi", course });
  } catch (err) {
    console.error("❌ Kursni yangilashda xatolik:", err);
    res.status(500).json({ error: "Kursni yangilashda xatolik" });
  }
});

// 🗑️ Kursni o'chirish
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });
    res.json({ message: "✅ Kurs o'chirildi" });
  } catch (err) {
    console.error("❌ Kursni o'chirishda xatolik:", err);
    res.status(500).json({ error: "Kursni o'chirishda xatolik" });
  }
});

// 🧠 Kod yuborish va baholash
router.post("/submit/:courseId/:taskIndex", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;
  const { courseId, taskIndex } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Kurs topilmadi" });

    const task = course.tasks[taskIndex];
    if (!task) return res.status(404).json({ error: "Vazifa topilmadi" });

    // AI kodni baholaydi
    const result = await aiEvaluateCode(code, taskIndex);

    if (result.passed) {
      const user = await User.findById(userId);

      // ✅ Agar vazifa oldin bajarilmagan bo‘lsa
      const alreadyCompleted = user.completedTasks.some(
        (t) => t.courseId == courseId && t.taskIndex == taskIndex
      );

      if (!alreadyCompleted) {
        user.completedTasks.push({ courseId, taskIndex }); // Vazifani yozib qo‘y
        user.points += 10; // 🏆 Ball berish

        // 🚀 Kursni boshlagan foydalanuvchi sifatida yozamiz
        if (taskIndex === 0 && !user.courses.includes(courseId)) {
          user.courses.push(courseId);
        }

        // 🌟 Agar barcha vazifalar tugasa level oshadi
        if (taskIndex + 1 === course.tasks.length) {
          user.level += 1;
        }

        await user.save();
      }
    }

    res.json({
      feedback: result.feedback,
      passed: result.passed,
    });
  } catch (err) {
    console.error("❌ Kodni yuborishda xatolik:", err);
    res.status(500).json({ error: "Kod tekshiruvda xatolik" });
  }
});

module.exports = router;
