import json
from backend.agents.base_agent import BaseAgent
from backend.config import config

class ResumeAnalyzerAgent(BaseAgent):
    def __init__(self, retriever=None):
        super().__init__(retriever=retriever)
        self.system_instruction = (
            "You are an elite ATS (Applicant Tracking System) analyzer with 15+ years of "
            "talent acquisition experience at Fortune 500 companies including Google, Amazon, "
            "Deloitte, Infosys, TCS, and Wipro. You understand ATS algorithms used by Workday, "
            "Taleo, Greenhouse, Lever, and iCIMS. You speak both US and Indian job market languages.\n\n"
            "ATS SCORING WEIGHTS (apply these):\n"
            "  Work Experience relevance: 35%\n"
            "  Skills keyword match:       25%\n"
            "  Education match:            15%\n"
            "  Formatting/ATS-readability: 15%\n"
            "  Quantified achievements:    10%"
        )

    def process(self, input_data: dict) -> dict:
        resume_text = input_data.get("resume_text", "")
        target_role = input_data.get("target_role", "")
        return self.analyze(resume_text, target_role)

    def analyze(self, resume_text: str, target_role: str) -> dict:
        job_context = self._retrieve_context(target_role, config.COLLECTION_JOBS)
        
        prompt = f"""
Analyze this resume for the target role: **{target_role}**

RESUME CONTENT:
{resume_text}

RELEVANT JOB DESCRIPTIONS (from knowledge base):
{job_context}

Return ONLY valid JSON (no markdown, no explanation):
{{
  "ats_score": <integer 0-100>,
  "grade": "<A+/A/B+/B/C/D>",
  "keyword_analysis": {{
    "found_keywords": ["keyword1", "keyword2"],
    "missing_critical_keywords": ["missing1", "missing2"],
    "match_percentage": <integer 0-100>
  }},
  "section_scores": {{
    "work_experience": <0-100>,
    "education": <0-100>,
    "skills_section": <0-100>,
    "formatting_clarity": <0-100>,
    "quantified_achievements": <0-100>
  }},
  "strengths": ["strength1", "strength2", "strength3"],
  "critical_improvements": ["improvement1", "improvement2"],
  "quick_wins": ["quick_fix1", "quick_fix2"],
  "missing_sections": ["section_that_should_be_added"],
  "action_verbs_used": ["led", "built", "achieved"],
  "industry_alignment": "<high/medium/low>",
  "readability_score": <0-100>,
  "summary_feedback": "<2-3 sentence overall assessment>",
  "recommended_job_titles": ["title1", "title2"]
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def _calculate_ats_score(self, resume_text: str, job_context: str) -> dict:
        prompt = f"""
Calculate ATS match score for this resume against the job description.
Return ONLY JSON.
{{ "ats_score": <int>, "match_details": "<str>" }}

Resume: {resume_text}
Job: {job_context}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def _extract_keywords(self, text: str) -> list:
        prompt = f"""
Extract the top 20 technical and professional keywords from the following text.
Return ONLY a JSON list of strings (no markdown, no dictionary).
Text: {text}
"""
        response = self._call_gemini(prompt)
        parsed = self._parse_json_response(response)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and "keywords" in parsed:
            return parsed["keywords"]
        return []

    def _compare_with_job_requirements(self, resume_keywords: list, job_keywords: list) -> dict:
        resume_set = set([k.lower() for k in resume_keywords])
        job_set = set([k.lower() for k in job_keywords])
        
        found = list(job_set.intersection(resume_set))
        missing = list(job_set.difference(resume_set))
        
        match_percentage = 0
        if job_set:
            match_percentage = int((len(found) / len(job_set)) * 100)
            
        return {
            "found_keywords": found,
            "missing_keywords": missing,
            "match_percentage": match_percentage
        }
