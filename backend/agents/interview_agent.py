import uuid
import json
from backend.agents.base_agent import BaseAgent
from backend.config import config

class InterviewAgent(BaseAgent):
    def __init__(self, retriever=None):
        super().__init__(retriever=retriever)
        self.system_instruction = (
            "You are a senior interviewer who has conducted 5000+ interviews at top companies "
            "including Google, Microsoft, Amazon, Flipkart, Infosys, Accenture, and McKinsey. "
            "You excel at technical, behavioral, and case-study interviews. You are firm but "
            "encouraging. You give specific, actionable feedback using the STAR framework. "
            "You know what separates good answers from great ones."
        )

    def process(self, input_data: dict) -> dict:
        action = input_data.get("action")
        if action == "generate_questions":
            return self.generate_questions(
                input_data.get("role", ""),
                input_data.get("level", ""),
                input_data.get("round_type", "")
            )
        elif action == "evaluate_answer":
            return self.evaluate_answer(
                input_data.get("question", ""),
                input_data.get("answer", ""),
                input_data.get("role", ""),
                input_data.get("level", "Mid")
            )
        elif action == "summarize_session":
            return self.summarize_session(
                input_data.get("qa_history", []),
                input_data.get("role", "")
            )
        return {"error": "Invalid action specified."}

    def generate_questions(self, role: str, level: str, round_type: str) -> dict:
        retrieved_questions = self._retrieve_context(f"{role} {level} {round_type}", config.COLLECTION_INTERVIEWS)
        
        prompt = f"""
Role: {role}  |  Level: {level}  |  Round: {round_type}
Retrieved interview questions from database: {retrieved_questions}

Generate a complete interview set. Return ONLY JSON:
{{
  "session_id": "{str(uuid.uuid4())}",
  "role": "{role}",
  "total_questions": 8,
  "estimated_duration": "45 minutes",
  "questions": [
    {{
      "id": 1,
      "question": "<question text>",
      "type": "<technical|behavioral|situational|cultural>",
      "difficulty": "<easy|medium|hard>",
      "time_limit_seconds": 120,
      "what_interviewer_looks_for": "<key points>",
      "hint": "<optional hint for practice mode>"
    }}
  ],
  "opening_message": "<warm opening for mock interview session>",
  "evaluation_criteria": ["criterion1", "criterion2"]
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def evaluate_answer(self, question: str, answer: str, role: str, level: str = "Mid") -> dict:
        prompt = f"""
Question: {question}
Candidate Answer: {answer}
Role Being Interviewed For: {role}
Experience Level: {level}

Evaluate the answer. Return ONLY JSON:
{{
  "score": <0-10>,
  "verdict": "<Excellent|Good|Average|Needs Improvement|Incomplete>",
  "feedback": "<2-3 sentences of specific feedback>",
  "what_was_strong": "<what they did well>",
  "what_was_missing": "<what was lacking>",
  "model_answer_outline": "<key points of a great answer>",
  "follow_up_question": "<natural follow-up to probe deeper>",
  "star_compliance": <true|false>,
  "communication_score": <0-10>,
  "technical_accuracy": <0-10>
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)

    def generate_follow_up(self, question: str, answer: str) -> str:
        prompt = f"""
Given the question: "{question}"
And the candidate's answer: "{answer}"
Generate a single, natural follow-up question to probe deeper into their answer.
Return ONLY the question string, no JSON, no formatting.
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return response.strip()

    def summarize_session(self, qa_history: list, role: str) -> dict:
        qa_history_json = json.dumps(qa_history, indent=2)
        prompt = f"""
Interview Q&A History: {qa_history_json}
Role: {role}

Provide session summary as JSON:
{{
  "overall_score": <0-100>,
  "hire_recommendation": "<Strong Yes|Yes|Maybe|No>",
  "top_strengths": ["strength1", "strength2"],
  "areas_for_improvement": ["area1", "area2"],
  "performance_by_type": {{
    "technical": <0-100>,
    "behavioral": <0-100>,
    "communication": <0-100>
  }},
  "personalized_study_plan": ["topic1", "topic2"],
  "encouragement_message": "<motivating closing message>"
}}
"""
        response = self._call_gemini(prompt, system_instruction=self.system_instruction)
        return self._parse_json_response(response)
