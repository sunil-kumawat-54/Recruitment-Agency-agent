import json
from backend.agents.base_agent import BaseAgent
from backend.config import config

class JobMatchingAgent(BaseAgent):
    def __init__(self, retriever=None):
        super().__init__(retriever=retriever)
        self.system_instruction = (
            "You are an expert job-candidate matching specialist who understands both "
            "technical skills and soft skills, culture alignment, and growth trajectory. "
            "You go beyond keyword matching to assess genuine career fit. "
            "You're familiar with hiring practices at startups, MNCs, and Indian IT companies."
        )

    def process(self, input_data: dict) -> dict:
        return self.find_matches(input_data)

    def find_matches(self, candidate_profile: dict) -> dict:
        skills = candidate_profile.get("skills", "")
        years_experience = candidate_profile.get("experience", 0)
        current_role = candidate_profile.get("current_role", "")
        education = candidate_profile.get("education", "")
        location = candidate_profile.get("location", "")
        expected_salary = candidate_profile.get("expected_salary", "")

        query = f"{current_role} {skills} {location}"
        retrieved_jobs = self._retrieve_context(query, config.COLLECTION_JOBS)
        
        prompt = f"""
Candidate Profile:
- Skills: {skills}
- Experience: {years_experience} years
- Current Role: {current_role}
- Education: {education}
- Preferred Location: {location}
- Expected Salary: {expected_salary}

Retrieved Job Listings:
{retrieved_jobs}

Return ONLY JSON:
{{
  "total_matches": <count>,
  "top_matches": [
    {{
      "job_id": "<id>",
      "job_title": "<title>",
      "company": "<company>",
      "location": "<location>",
      "match_percentage": <0-100>,
      "salary_range": "<range>",
      "match_breakdown": {{
        "skills_match": <0-100>,
        "experience_match": <0-100>,
        "education_match": <0-100>,
        "location_match": <0-100>
      }},
      "why_this_job": "<2-sentence explanation>",
      "potential_concerns": ["concern1"],
      "application_tip": "<specific advice for this application>",
      "apply_link_placeholder": "#"
    }}
  ],
  "recommended_resume_tweaks": ["tweak1 for better matching"],
  "market_demand": "<High|Medium|Low> demand for your profile"
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def calculate_match_score(self, candidate: dict, job: dict) -> dict:
        prompt = f"Calculate detailed match score for Candidate: {json.dumps(candidate)} and Job: {json.dumps(job)}. Return ONLY JSON containing breakdown."
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def generate_application_tips(self, candidate: dict, job: dict) -> str:
        prompt = f"Generate specific application tips and interview prep strategy for Candidate: {json.dumps(candidate)} applying to Job: {json.dumps(job)}."
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return response.strip()
