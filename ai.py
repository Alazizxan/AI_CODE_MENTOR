from flask import Flask, request, jsonify
from gpt4all import GPT4All

# GPT4All modelini yuklash
model = GPT4All("ggml-gpt4all-j-v1.3-groovy.bin")  # Modelni oldin yuklab qo‘yish kerak

app = Flask(__name__)

@app.route('/ai/evaluate', methods=['POST'])
def evaluate_code():
    data = request.json
    code = data.get('code')
    level = data.get('level', 1)

    prompt = f"""
Siz programmist mentor bo‘lib, foydalanuvchining kodini pedagogik tilda tekshirasiz.

Foydalanuvchi kodi:
{code}

1️⃣ Xato bo‘lsa, uni tushuntiring va qanday tuzatish kerakligini ayting.
2️⃣ Agar to‘g‘ri bo‘lsa, quyidagi motivatsion gapni yozing:
"✅ Zo‘r! Endi {level + 1}-bosqichga o‘tishingiz mumkin 🎉"
"""

    # Modeldan javob olish
    response = model.generate(prompt, max_tokens=512)
    return jsonify({"feedback": response})

if __name__ == '__main__':
    app.run(port=5001)
