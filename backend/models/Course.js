const mongoose = require("mongoose");

// 📝 Har bir dars (video) uchun schema
const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },        // 🎬 Video nomi
  videoUrl: { type: String, required: true },     // 📹 Video URL
  duration: { type: Number },                     // 🕐 Davomiyligi (optional)
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  level: Number,
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tasks: [TaskSchema],             // 📝 Kodli vazifalar
  lessons: [LessonSchema],         // 🆕 Video darslar
  premium: {
    type: Boolean,
    default: false,                // 🆕 Premium kurs flag
  },
});

module.exports = mongoose.model("Course", CourseSchema);
