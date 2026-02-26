import json
import os
import re
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# --- Database Setup (Objective 3.2) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./codementor.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model for Progress Tracking
class UserProgress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, default="Guest User")
    last_quiz_score = Column(Float, default=0.0)
    challenges_completed = Column(Integer, default=0)

Base.metadata.create_all(bind=engine)

# --- FastAPI App ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class ChatMessage(BaseModel):
    message: str

class DebugRequest(BaseModel):
    code: str

class ScoreUpdate(BaseModel):
    score: float

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Professional Routes ---

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    # Fetch current stats for the Dashboard
    stats = db.query(UserProgress).first()
    if not stats:
        stats = UserProgress(username="Developer")
        db.add(stats)
        db.commit()
    return {
        "status": "Online",
        "user": stats.username,
        "score": stats.last_quiz_score,
        "completed": stats.challenges_completed
    }

# 1. QUIZ SYSTEM
# --- Paths (Improved for Debugging) ---
# This looks for the 'data' folder in the project root, regardless of where main.py is
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "quizzes.json")

# 1. QUIZ SYSTEM
@app.get("/api/quizzes")
async def get_quizzes():
    print(f"DEBUG: Looking for quizzes at: {DATA_PATH}") # Check your terminal for this!
    
    if not os.path.exists(DATA_PATH):
        print("DEBUG: File not found!")
        return [{"id": 0, "question": "Error: quizzes.json not found at " + DATA_PATH, "options": ["Check Path", "Move File"], "answer": "Check Path"}]
    
    try:
        with open(DATA_PATH, "r", encoding='utf-8') as f:
            data = json.load(f)
            return data
    except Exception as e:
        print(f"DEBUG: JSON Error: {e}")
        return [{"id": 0, "question": "Error loading JSON: " + str(e), "options": ["Fix JSON", "Retry"], "answer": "Fix JSON"}]

@app.post("/api/save-score")
async def save_score(data: ScoreUpdate, db: Session = Depends(get_db)):
    stats = db.query(UserProgress).first()
    stats.last_quiz_score = data.score
    stats.challenges_completed += 1
    db.commit()
    return {"message": "Progress saved!"}

# 2. CHAT HELPER (AI-Professional Tone)
@app.post("/api/chat")
async def chat_logic(chat: ChatMessage):
    text = chat.message.lower()
    
    responses = {
        "hello": "Hello! I am your CodeMentor AI. I can help you with Python basics, debugging, and quizzes. What are we learning today?",
        "hi": "Hi there! Ready to write some Python code? Ask me about variables, loops, or functions!",
        "who are you": "I am CodeMentor AI, your personal programming tutor designed to make learning Python easy and interactive.",
        "variable": "Variables are containers for storing data. In Python, you create one just by assigning a value: `x = 5`. No special command needed!",
        "string": "A string is a sequence of characters inside quotes. Example: `name = 'CodeMentor'`. You can join them using `+`.",
        "integer": "Integers (int) are whole numbers without decimals, like `10` or `-5`.",
        "float": "Floats are numbers with decimal points, like `3.14` or `10.0`.",
        "boolean": "Booleans represent one of two values: `True` or `False`. They are essential for logic and 'if' statements.",
        "list": "A list is an ordered collection that can be changed (mutable). Example: `fruits = ['apple', 'banana']`. Use `.append()` to add items.",
        "dictionary": "Dictionaries store data in key-value pairs. Example: `student = {'name': 'Ali', 'grade': 'A'}`.",
        "tuple": "Tuples are like lists but cannot be changed after creation (immutable). We define them with parentheses: `colors = ('red', 'green')`.",
        "loop": "Loops let you run code multiple times. Use a `for` loop to iterate over a list, and a `while` loop to run as long as a condition is true.",
        "if statement": "If statements check a condition. If it's true, the code inside runs. Example: `if x > 5: print('Big!')`.",
        "function": "Functions are reusable blocks of code. You define them with `def`, like this: `def my_function():`. They help keep your code organized.",
        "error": "Encountered an error? Try checking your indentation or missing colons (:). You can also paste your code in the 'Debug' tab!",
        "indentation": "In Python, indentation is mandatory! It tells the computer which lines of code belong to a function or a loop.",
        "comment": "Use the `#` symbol to write comments. Comments are ignored by the computer and are just for humans to read.",
    }

    matched_key = next((key for key in sorted(responses.keys(), key=len, reverse=True) if key in text), None)
    
    if matched_key:
        reply = responses[matched_key]
    else:
        reply = "I'm specialized in Python basics! I'm still in training. Try asking about 'loops', 'variables', 'functions', or 'lists'."
    
    return {"reply": reply}

# 3. DEBUG ASSISTANT
@app.post("/api/debug")
async def debug_logic(request: DebugRequest):
    code = request.code
    lines = code.split('\n')
    corrected_lines = []
    errors = []
    
    for i, line in enumerate(lines):
        new_line = line
        keywords = ('def', 'if', 'for', 'while', 'elif', 'else', 'class')
        if any(new_line.strip().startswith(k) for k in keywords) and not new_line.strip().endswith(':'):
            errors.append(f"Missing colon on line {i+1}")
            new_line = new_line.rstrip() + ":"
            
        if "print " in new_line and "(" not in new_line:
            errors.append(f"Missing parentheses for print on line {i+1}")
            content = new_line.replace("print", "").strip()
            indent = len(new_line) - len(new_line.lstrip())
            new_line = (" " * indent) + f"print({content})"
            
        if new_line.strip().startswith("if ") and " = " in new_line and " == " not in new_line:
            errors.append(f"Used '=' instead of '==' on line {i+1}")
            new_line = new_line.replace(" = ", " == ")

        corrected_lines.append(new_line)

    if not errors:
        return {
            "status": "success",
            "message": "Your code is perfect!",
            "corrected_code": None
        }

    return {
        "status": "error",
        "message": " | ".join(errors),
        "suggestion": "I've fixed the syntax errors for you below.",
        "corrected_code": "\n".join(corrected_lines)
    }