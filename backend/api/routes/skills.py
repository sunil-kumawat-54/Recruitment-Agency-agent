from fastapi import APIRouter, HTTPException
from backend.agents.skill_gap_agent import SkillGapAgent
from backend.utils.helpers import logger
from pydantic import BaseModel
from typing import List, Union

router = APIRouter(prefix="/skills", tags=["Skills"])

class SkillGapRequest(BaseModel):
    current_skills: Union[List[str], str]
    target_role: str = "Software Engineer"
    target_level: str = "Mid"
    timeline_months: int = 6
    hours_per_week: int = 10

@router.post("/gap")
async def analyze_skill_gap(req: SkillGapRequest):
    """
    Computes candidate skill gap scores and provides visual radar coordinate values,
    critical milestones, and chronological phase-wise upskilling maps.
    """
    try:
        agent = SkillGapAgent()
        gap_report = agent.process({
            "current_skills": req.current_skills,
            "target_role": req.target_role,
            "target_level": req.target_level,
            "timeline_months": req.timeline_months,
            "hours_per_week": req.hours_per_week
        })
        return gap_report
    except Exception as e:
        logger.error(f"Error executing skill gap analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
