import json
from backend.agents.base_agent import BaseAgent
from backend.config import config

class SkillGapAgent(BaseAgent):
    def __init__(self, retriever=None):
        super().__init__(retriever=retriever)
        self.system_instruction = (
            "You are a senior career development coach and learning architect with expertise in "
            "upskilling professionals across tech, business, and creative industries. You have "
            "deep knowledge of Coursera, Udemy, YouTube learning paths, GitHub projects, and "
            "free resources. You give realistic timelines and prioritize high-ROI skills first. "
            "You understand both global and Indian job market requirements."
        )

    def process(self, input_data: dict) -> dict:
        current_skills = input_data.get("current_skills", [])
        target_role = input_data.get("target_role", "")
        target_level = input_data.get("target_level", "Mid")
        hours_per_week = input_data.get("hours_per_week", 10)
        timeline_months = input_data.get("timeline_months", 6)
        return self.analyze_gap(current_skills, target_role, target_level, hours_per_week, timeline_months)

    def analyze_gap(self, current_skills: list, target_role: str, target_level: str, hours_per_week: int, timeline_months: int) -> dict:
        # Format skills for prompt
        current_skills_str = ", ".join(current_skills) if isinstance(current_skills, list) else str(current_skills)
        retrieved_requirements = self._retrieve_context(target_role, config.COLLECTION_JOBS)
        
        prompt = f"""
Current Skills: {current_skills_str}
Target Role: {target_role}
Target Level: {target_level}
Available Learning Time: {hours_per_week} hours/week
Timeline: {timeline_months} months

Job requirements retrieved from knowledge base:
{retrieved_requirements}

Provide complete skill gap analysis. Return ONLY JSON:
{{
  "gap_score": <0-100, 100 means fully ready>,
  "readiness_level": "<Job Ready|Almost Ready|Significant Gap|Major Pivot>",
  "time_to_ready": "<X weeks/months estimate>",
  "skills_you_have": [
    {{"skill": "Python", "relevance": "critical", "your_level": "advanced"}}
  ],
  "critical_gaps": [
    {{
      "skill": "Docker",
      "importance": "critical",
      "effort_to_learn": "<2 weeks | 1 month | 3 months>",
      "why_needed": "<why this skill matters for the role>",
      "free_resource": "<specific YouTube channel, GitHub, docs URL>",
      "paid_resource": "<Coursera/Udemy course name>"
    }}
  ],
  "nice_to_have_gaps": [
    {{
      "skill": "skill_name",
      "importance": "nice_to_have",
      "effort_to_learn": "estimate",
      "why_needed": "reason",
      "free_resource": "link",
      "paid_resource": "link"
    }}
  ],
  "learning_roadmap": [
    {{
      "phase": 1,
      "phase_name": "Foundation",
      "duration": "Weeks 1-4",
      "skills_to_learn": ["skill1", "skill2"],
      "daily_tasks": ["task1", "task2"],
      "milestone": "<what you can do at end of phase>",
      "project_to_build": "<hands-on project idea>"
    }}
  ],
  "radar_chart_data": {{
    "categories": ["Python", "SQL", "ML", "Cloud", "Communication"],
    "current_scores": [80, 60, 30, 20, 70],
    "target_scores": [90, 80, 75, 60, 80]
  }},
  "motivational_message": "<personalized encouragement>"
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def generate_roadmap(self, gaps: list, timeline_months: int) -> list:
        gaps_str = ", ".join(gaps)
        prompt = f"""
Given the following skill gaps: {gaps_str}
Create a step-by-step learning roadmap spanning {timeline_months} months.
Return ONLY a JSON list of roadmap phase objects.
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        parsed = self._parse_json_response(response)
        
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and "learning_roadmap" in parsed:
            return parsed["learning_roadmap"]
        return []

    def recommend_resources(self, skill: str) -> dict:
        prompt = f"""
Provide the best free and paid learning resources to master the skill: {skill}.
Return ONLY JSON:
{{
    "skill": "{skill}",
    "free_resources": ["resource 1", "resource 2"],
    "paid_resources": ["course 1", "course 2"],
    "projects_to_practice": ["project 1", "project 2"]
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)
