from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from pydantic import BaseModel
from backend.agents.resume_analyzer import ResumeAnalyzerAgent
from backend.utils.pdf_parser import parse_resume_to_dict

# Attempt to load global retriever if available
try:
    from backend.rag.retriever import retriever
except ImportError:
    retriever = None

router = APIRouter(prefix="/api/resume", tags=["Resume"])

class ATSScoreRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/analyze")
async def analyze_resume(
    target_role: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # Read the file bytes directly
        content = await file.read()
        parsed_data = parse_resume_to_dict(content, file.filename)
        resume_text = parsed_data.get("full_text", "")
        
        if not resume_text:
            raise ValueError("No text could be extracted from the provided file.")

        agent = ResumeAnalyzerAgent(retriever=retriever)
        report = agent.analyze(resume_text, target_role)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/ats-score")
async def ats_score(req: ATSScoreRequest):
    try:
        agent = ResumeAnalyzerAgent(retriever=retriever)
        result = agent._calculate_ats_score(req.resume_text, req.job_description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS Scoring failed: {str(e)}")

@router.get("/sample-report")
async def sample_report():
    """Returns a demo analysis result."""
    return {
        "ats_score": 85,
        "grade": "A",
        "keyword_analysis": {
            "found_keywords": ["Python", "FastAPI", "Docker", "SQL"],
            "missing_critical_keywords": ["Kubernetes", "AWS"],
            "match_percentage": 80
        },
        "section_scores": {
            "work_experience": 90,
            "education": 100,
            "skills_section": 85,
            "formatting_clarity": 75,
            "quantified_achievements": 60
        },
        "strengths": [
            "Strong backend development experience",
            "Relevant computer science degree"
        ],
        "critical_improvements": [
            "Add more quantified achievements (e.g., 'reduced latency by 20%')",
            "Improve formatting for better ATS parsing"
        ],
        "quick_wins": [
            "Include Kubernetes in skills if experienced",
            "Use standard section headers like 'Experience' instead of 'Work History'"
        ],
        "missing_sections": ["Projects", "Certifications"],
        "action_verbs_used": ["developed", "engineered", "optimized"],
        "industry_alignment": "high",
        "readability_score": 88,
        "summary_feedback": "A strong software engineering resume with excellent core skills. Needs more quantifiable metrics to achieve an A+ grade.",
        "recommended_job_titles": ["Backend Engineer", "Software Engineer", "Python Developer"]
    }
