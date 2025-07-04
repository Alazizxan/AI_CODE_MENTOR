async function aiEvaluateCode(code, level) {
  // Bu oddiy tekshiruvchi: kod ichida "print" so‘zi bo‘lsa o'tkazadi
  if (code.includes("print")) {
    return {
      passed: true,
      feedback: `✅ Kod to'g'ri. 🎉 ${level + 1}-bosqichga o'tdingiz.`,
    };
  } else {
    return {
      passed: false,
      feedback: "❌ Kod noto'g'ri. Iltimos, qayta urinib ko'ring.",
    };
  }
}

module.exports = { aiEvaluateCode };
