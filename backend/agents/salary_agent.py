import json
from backend.agents.base_agent import BaseAgent
from backend.config import config

class SalaryNegotiationAgent(BaseAgent):
    def __init__(self, retriever=None):
        super().__init__(retriever=retriever)
        self.system_instruction = (
            "You are a compensation negotiation expert who has helped 10,000+ professionals "
            "negotiate higher salaries. You combine market research with proven psychological "
            "negotiation tactics. You're knowledgeable about Indian IT salary benchmarks (TCS, "
            "Infosys, Wipro, HCL, Cognizant, startups) AND global tech salaries. You are "
            "direct, data-driven, and empowering. You never undersell your clients."
        )

    def process(self, input_data: dict) -> dict:
        role = input_data.get("role", "")
        experience = input_data.get("experience", 0)
        location = input_data.get("location", "")
        skills = input_data.get("skills", [])
        current_ctc = input_data.get("current_ctc", "")
        received_offer = input_data.get("received_offer", "")
        
        return self.get_salary_range(role, experience, location, skills, current_ctc, received_offer)

    def get_salary_range(self, role: str, experience: int, location: str, skills: list, current_ctc: str = "", received_offer: str = "") -> dict:
        skills_str = ", ".join(skills) if isinstance(skills, list) else str(skills)
        query = f"{role} {location} salary compensation trends"
        retrieved_salary_data = self._retrieve_context(query, config.COLLECTION_TRENDS)
        
        prompt = f"""
Role: {role}
Experience: {experience} years
Location: {location} (City/Country)
Skills: {skills_str}
Current CTC (if employed): {current_ctc}
Received Offer (if any): {received_offer}

Retrieved market salary data:
{retrieved_salary_data}

Return ONLY JSON:
{{
  "market_salary_range": {{
    "minimum": <number>,
    "median": <number>,
    "maximum": <number>,
    "currency": "INR/USD",
    "per": "annum"
  }},
  "your_market_value": <number based on their specific profile>,
  "negotiation_verdict": "<Underpaid|Fairly Paid|Overpaid|At Market>",
  "recommended_ask": <number>,
  "negotiation_strategy": {{
    "opening_number": <number>,
    "minimum_acceptable": <number>,
    "ideal_outcome": <number>,
    "strategy_name": "<Anchoring|BATNA|Value-First|Competing Offers>"
  }},
  "talking_points": [
    "<specific, data-backed talking point>"
  ],
  "phrases_to_use": [
    "<exact phrase to say in negotiation>"
  ],
  "phrases_to_avoid": [
    "<phrase that weakens your position>"
  ],
  "email_template": "<full negotiation email ready to send>",
  "non_salary_benefits_to_negotiate": ["WFH days", "Learning budget", "ESOPs"],
  "confidence_level": "<High|Medium|Low>",
  "market_trend": "<Salary growing|Stable|Declining> for this role in 2025"
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def generate_negotiation_strategy(self, offer: float, market_data: dict, profile: dict) -> dict:
        prompt = f"Given the offer {offer}, market data {json.dumps(market_data)}, and profile {json.dumps(profile)}, generate a targeted negotiation strategy. Return ONLY JSON."
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def generate_negotiation_email(self, context: dict) -> str:
        prompt = f"Write a professional, empowering negotiation email based on this context: {json.dumps(context)}."
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return response.strip()
