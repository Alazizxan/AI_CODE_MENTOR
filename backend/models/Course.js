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
});

module.exports = mongoose.model("Course", CourseSchema);
