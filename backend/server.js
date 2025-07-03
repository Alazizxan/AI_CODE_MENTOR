const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/course", require("./routes/course"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB Atlas ulanish muvaffaqiyatli!");
  app.listen(PORT, () =>
    console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`)
  );
}).catch((err) => console.error("❌ MongoDB ulanmadi:", err.message));
