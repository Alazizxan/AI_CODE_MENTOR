function aiEvaluator(code, level) {
  if (level == 1 && code.includes("Hello World")) {
    return { correct: true, feedback: "✅ Zo‘r! Hello World to‘g‘ri yozildi." };
  }
  if (level == 2 && code.includes("if")) {
    return { correct: true, feedback: "✅ If-Else bloklari to‘g‘ri ishlayapti." };
  }
  if (level == 3 && code.includes("for")) {
    return { correct: true, feedback: "✅ For loop to‘g‘ri ishlayapti." };
  }
  return { correct: false, feedback: "❌ Kodni tekshirib ko‘ring." };
}

module.exports = aiEvaluator;
