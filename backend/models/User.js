const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  completedTasks: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      taskIndex: { type: Number },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
