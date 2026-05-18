from fastapi import APIRouter, HTTPException
from backend.agents.salary_agent import SalaryNegotiationAgent
from backend.utils.helpers import logger
from pydantic import BaseModel
from typing import List, Optional, Union

router = APIRouter(prefix="/salary", tags=["Salary"])

class SalaryRequest(BaseModel):
    role: str = "Software Engineer"
    years_experience: int = 3
    location: str = "Bangalore"
    skills: Union[List[str], str] = []
    current_ctc: Optional[str] = ""
    received_offer: Optional[str] = ""

@router.post("/guide")
async def get_salary_guide(req: SalaryRequest):
    """
    Looks up salary trends and city adjustments in ChromaDB, and returns 
    target anchoring strategies and counter-offer email templates.
    """
    try:
        agent = SalaryNegotiationAgent()
        salary_report = agent.process({
            "role": req.role,
            "years_experience": req.years_experience,
            "location": req.location,
            "skills": req.skills,
            "current_ctc": req.current_ctc,
            "received_offer": req.received_offer
        })
        return salary_report
    except Exception as e:
        logger.error(f"Error in salary guidance route: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
