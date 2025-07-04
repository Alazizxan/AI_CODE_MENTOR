const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  level: Number,
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tasks: [TaskSchema],
  premium: {
    type: Boolean,
    default: false, // 🆕 Premium kursmi yoki yo‘qmi
  },
});

module.exports = mongoose.model("Course", CourseSchema);
