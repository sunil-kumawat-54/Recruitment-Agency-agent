from fastapi import APIRouter, HTTPException
from backend.agents.job_matching_agent import JobMatchingAgent
from backend.utils.helpers import logger
from pydantic import BaseModel
from typing import List, Union

router = APIRouter(prefix="/jobs", tags=["Jobs"])

class JobMatchRequest(BaseModel):
    skills: Union[List[str], str]
    years_experience: int = 2
    current_role: str = "Software Engineer"
    education: str = "Bachelor of Science"
    location: str = "Bangalore"
    expected_salary: str = "15 LPA"

@router.post("/match")
async def match_jobs(req: JobMatchRequest):
    """
    Evaluates candidate profile vectors against all job description assets stored 
    in local ChromaDB collections and scores individual fit compatibility.
    """
    try:
        agent = JobMatchingAgent()
        matches = agent.process({
            "skills": req.skills,
            "years_experience": req.years_experience,
            "current_role": req.current_role,
            "education": req.education,
            "location": req.location,
            "expected_salary": req.expected_salary
        })
        return matches
    except Exception as e:
        logger.error(f"Error in job matching pipeline: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
