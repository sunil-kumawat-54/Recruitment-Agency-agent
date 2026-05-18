from fastapi import APIRouter, HTTPException
from backend.agents.interview_agent import InterviewAgent
from backend.utils.helpers import logger
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/interview", tags=["Interview"])

class StartRequest(BaseModel):
    role: str = "Software Engineer"
    level: str = "Mid"
    round_type: str = "Technical"

class EvaluateRequest(BaseModel):
    question: str
    candidate_answer: str
    role: str = "Software Engineer"
    level: str = "Mid"

class QAPair(BaseModel):
    question: str
    answer: str
    score: Optional[float] = None
    type: Optional[str] = None

class CompleteRequest(BaseModel):
    qa_history: List[dict] # Contains list of question and answer dicts
    role: str = "Software Engineer"

@router.post("/start")
async def start_interview(req: StartRequest):
    """
    Starts a mock interview session and returns a structured question pack.
    """
    try:
        agent = InterviewAgent()
        questions_pack = agent.process({
            "action": "generate_questions",
            "role": req.role,
            "level": req.level,
            "round_type": req.round_type
        })
        return questions_pack
    except Exception as e:
        logger.error(f"Error starting interview session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate")
async def evaluate_answer(req: EvaluateRequest):
    """
    Evaluates an answer given by the candidate for a specific interview question.
    """
    try:
        agent = InterviewAgent()
        feedback = agent.process({
            "action": "evaluate_answer",
            "question": req.question,
            "candidate_answer": req.candidate_answer,
            "role": req.role,
            "level": req.level
        })
        return feedback
    except Exception as e:
        logger.error(f"Error evaluating answer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/complete")
async def complete_interview(req: CompleteRequest):
    """
    Completes the session, aggregates scores, and generates career-roadmap study guides.
    """
    try:
        agent = InterviewAgent()
        summary = agent.process({
            "action": "summarize_session",
            "qa_history": req.qa_history,
            "role": req.role
        })
        return summary
    except Exception as e:
        logger.error(f"Error completing interview session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
