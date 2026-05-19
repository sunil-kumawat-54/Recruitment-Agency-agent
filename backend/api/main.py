import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from backend.config import config
from backend.rag.vectorstore import vector_store
from backend.rag.ingestion import DataIngestionPipeline

# --- AGENTS & RETRIEVERS ---
from backend.api.routes.resume import router as resume_router
from backend.agents.interview_agent import InterviewAgent
from backend.agents.skill_gap_agent import SkillGapAgent
from backend.agents.job_matching_agent import JobMatchingAgent
from backend.agents.salary_agent import SalaryNegotiationAgent

try:
    from backend.rag.retriever import retriever
except ImportError:
    retriever = None

app = FastAPI(title="HireIQ API", version="1.0.0")

# --- CORS MIDDLEWARE ---
cors_origins = [
    "http://localhost:5173",
    "http://localhost:8501",
    "https://orchestra-recruitment-agency-sunil-d.netlify.app",
]
env_cors = os.getenv("CORS_ORIGINS")
if env_cors:
    cors_origins.extend([origin.strip() for origin in env_cors.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL EXCEPTION HANDLER ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)},
    )

# --- STARTUP EVENT ---
@app.on_event("startup")
async def startup_event():
    try:
        stats = vector_store.get_collection_stats()
        total_docs = sum(stats.values())
        if total_docs == 0:
            print("Database empty. Seeding ChromaDB...")
            pipeline = DataIngestionPipeline()
            pipeline.run_seeding()
            print("Seeding complete.")
        else:
            print(f"ChromaDB ready. Existing documents: {total_docs}")
    except Exception as e:
        print(f"Startup DB Check Failed: {e}")

# --- PYDANTIC MODELS ---
class InterviewStartRequest(BaseModel):
    role: str
    level: str
    roundType: str = "Technical"

class InterviewEvaluateRequest(BaseModel):
    question: str
    answer: str
    role: str
    level: str = "Mid"

class InterviewCompleteRequest(BaseModel):
    history: List[dict]
    role: str

class SkillGapRequest(BaseModel):
    current_skills: str
    target_role: str
    target_level: str = "Mid"
    timeline_months: int = 6
    hours_per_week: int = 10

class JobMatchRequest(BaseModel):
    skills: str
    years_experience: int
    current_role: str
    education: str
    location: str
    expected_salary: str

class SalaryGuideRequest(BaseModel):
    role: str
    years_experience: int
    location: str
    skills: str = ""
    current_ctc: str = ""
    received_offer: str = ""

# --- ROUTERS ---
interview_router = APIRouter(prefix="/api/interview", tags=["Interview"])

@interview_router.post("/start")
async def start_interview(req: InterviewStartRequest):
    agent = InterviewAgent(retriever=retriever)
    return agent.generate_questions(req.role, req.level, req.roundType)

@interview_router.post("/evaluate")
async def evaluate_interview(req: InterviewEvaluateRequest):
    agent = InterviewAgent(retriever=retriever)
    return agent.evaluate_answer(req.question, req.answer, req.role, req.level)

@interview_router.post("/complete")
async def complete_interview(req: InterviewCompleteRequest):
    agent = InterviewAgent(retriever=retriever)
    return agent.summarize_session(req.history, req.role)

skills_router = APIRouter(prefix="/api/skills", tags=["Skills"])

@skills_router.post("/analyze")
async def analyze_skills(req: SkillGapRequest):
    agent = SkillGapAgent(retriever=retriever)
    return agent.analyze_gap(req.current_skills, req.target_role, req.target_level, req.timeline_months, req.hours_per_week)

jobs_router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@jobs_router.post("/match")
async def match_jobs(req: JobMatchRequest):
    agent = JobMatchingAgent(retriever=retriever)
    return agent.find_matches(req.dict())

salary_router = APIRouter(prefix="/api/salary", tags=["Salary"])

@salary_router.post("/guide")
async def get_salary(req: SalaryGuideRequest):
    agent = SalaryNegotiationAgent(retriever=retriever)
    return agent.get_salary_range(req.role, req.years_experience, req.location, req.skills.split(","))

# --- APP MOUNTS ---
app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(skills_router)
app.include_router(jobs_router)
app.include_router(salary_router)

@app.get("/")
async def root():
    return {
        "service": "HireIQ API",
        "status": "running",
        "docs": "/docs",
    }

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "agents": ["resume", "interview", "skills", "jobs", "salary"]
    }
