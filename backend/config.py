import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = "gemini-2.5-flash"           # Free tier compatible
    GEMINI_EMBED_MODEL = "models/embedding-001"
    CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))
    
    # ChromaDB Collections
    COLLECTION_JOBS = "job_descriptions"
    COLLECTION_INTERVIEWS = "interview_questions"
    COLLECTION_RESUMES = "resume_samples"
    COLLECTION_TRENDS = "industry_trends"
    
    # RAG Settings
    TOP_K = 5
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200

config = Config()
