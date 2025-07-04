const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  completedTasks: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      taskIndex: Number,
    },
  ],
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  premium: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
