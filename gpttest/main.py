from fastapi import FastAPI
from pydantic import BaseModel
import g4f
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS sozlamalari
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MentorPrompt(BaseModel):
    code: str
    level: int = 1

mentor_intro = (
    "Siz professional dasturchi mentorsiz. Foydalanuvchi kodini tahlil qiling:\n\n"
    "Kod:\n"
)

@app.post("/ai/evaluate")
async def evaluate_code(prompt: MentorPrompt):
    full_prompt = (
        mentor_intro + prompt.code + "\n\n"
        "1. Agar kodda xatolar bo'lsa, ularni tushuntiring\n"
        f"2. Agar kod to'g'ri bo'lsa: '✅ Zo'r! {prompt.level+1}-bosqichga o'tishingiz mumkin' deb yozing"
    )
    
    try:
        response = await g4f.ChatCompletion.create_async(
            model=g4f.models.gpt_4,
            messages=[{"role": "user", "content": full_prompt}]
        )
        
        passed = "✅" in response
        return {
            "passed": passed,
            "feedback": response,
            "next_level": prompt.level + 1 if passed else prompt.level
        }
        
    except Exception as e:
        return {
            "passed": False,
            "feedback": f"Xatolik: {str(e)}",
            "next_level": prompt.level
        }