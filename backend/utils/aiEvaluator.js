const axios = require("axios");

async function aiEvaluateCode(code, level) {
  try {
    const res = await axios.post("http://localhost:5001/ai/evaluate", {
      code,
      level
    });

    const msg = res.data.feedback;
    return { passed: msg.includes("✅"), feedback: msg };
  } catch (e) {
    console.error("❌ GPT4All bilan xato:", e.message);
    return { passed: false, feedback: "⚠️ AI bilan bog‘lanishda xatolik yuz berdi." };
  }
}

module.exports = { aiEvaluateCode };
