const axios = require("axios");

async function aiEvaluateCode(code, level) {
  try {
    const res = await axios.post("http://localhost:8000/ai/evaluate", {
      code,
      level
    }, {
      timeout: 10000
    });

    return {
      passed: res.data.passed,
      feedback: res.data.feedback,
      nextLevel: res.data.next_level || level
    };
    
  } catch (e) {
    console.error("AI baholash xatosi:", e.message);
    return {
      passed: false,
      feedback: "AI bilan aloqa xatosi",
      nextLevel: level
    };
  }
}

module.exports = { aiEvaluateCode };