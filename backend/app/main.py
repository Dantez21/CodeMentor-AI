import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, we allow all
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load quiz data
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "quizzes.json")

@app.get("/api/quizzes")
async def get_quizzes():
    with open(DATA_PATH, "r") as f:
        data = json.load(f)
    return data

@app.get("/")
def read_root():
    return {"status": "CodeMentor AI Backend Running"}