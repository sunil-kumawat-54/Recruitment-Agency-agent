import time
import uuid
from backend.rag.vectorstore import vector_store
from backend.config import config

class DataIngestionPipeline:
    def __init__(self):
        self.vs = vector_store

    def run_seeding(self):
        print("Starting Data Seeding Pipeline...")
        self._seed_jobs()
        self._seed_interviews()
        self._seed_trends()
        print("Data Seeding Complete.")

    def _seed_jobs(self):
        print("Seeding Job Descriptions...")
        roles = [
            "Software Engineer", "Data Scientist", "Data Analyst", "Product Manager",
            "DevOps Engineer", "Cloud Engineer", "Full Stack Developer", "ML Engineer",
            "HR Manager", "HR Generalist", "Business Analyst", "UI/UX Designer",
            "Marketing Manager", "Financial Analyst"
        ]
        levels = ["Junior", "Mid", "Senior"]
        company_types = ["Startup", "MNC", "Agency", "Fintech", "Healthtech"]
        locations = ["Bangalore", "Remote", "New York", "London", "Pune", "Hyderabad"]
        
        texts = []
        metadatas = []
        ids = []
        
        count = 0
        for role in roles:
            for level in levels:
                for ctype in company_types[:2]: # Generates 84 unique items
                    count += 1
                    title = f"{level} {role}"
                    reqs = f"Experience with tools standard to {role} roles."
                    resp = f"Drive {role} initiatives at a {ctype}."
                    skills = "Python, SQL, Communication, Agile" if "Engineer" in role else "Management, Analytics, Strategy"
                    loc = locations[count % len(locations)]
                    
                    text = f"Job Title: {title}\nCompany Type: {ctype}\nRequirements: {reqs}\nResponsibilities: {resp}\nSkills: {skills}"
                    meta = {
                        "role": role,
                        "level": level,
                        "industry": ctype,
                        "skills_required": skills,
                        "salary_range": "Competitive",
                        "location": loc,
                        "company_type": ctype
                    }
                    
                    texts.append(text)
                    metadatas.append(meta)
                    ids.append(f"job_{count}_{uuid.uuid4().hex[:6]}")
                    
        self.vs.add_documents(config.COLLECTION_JOBS, texts, metadatas, ids)

    def _seed_interviews(self):
        print("Seeding Interview Questions...")
        
        base_questions = [
            {
                "q": "Explain the difference between REST and GraphQL",
                "a": "REST uses multiple endpoints for resources, while GraphQL uses a single endpoint to fetch structured data dynamically.",
                "f": "When would you prefer REST over GraphQL?",
                "role": "Software Engineer",
                "type": "Technical",
                "difficulty": "Medium",
                "framework": "API Design"
            },
            {
                "q": "Tell me about a time you handled a difficult stakeholder",
                "a": "I used active listening, aligned their concerns with project goals, and provided data-driven alternatives.",
                "f": "What if they still refused to compromise?",
                "role": "General",
                "type": "Behavioral",
                "difficulty": "Medium",
                "framework": "STAR"
            },
            {
                "q": "Design a URL shortener like bit.ly",
                "a": "I'd use a hashing algorithm like Base62, store mappings in a NoSQL database, and use caching for fast redirection.",
                "f": "How would you handle high concurrency?",
                "role": "Software Engineer",
                "type": "System Design",
                "difficulty": "Hard",
                "framework": "Architecture"
            },
            {
                "q": "Why are you leaving your current company?",
                "a": "I am looking for new challenges and growth opportunities that align with my long-term career goals.",
                "f": "What specifically are you looking for here?",
                "role": "General",
                "type": "HR",
                "difficulty": "Easy",
                "framework": "Motivation"
            },
            {
                "q": "Our user retention dropped 20% last month. Diagnose the issue.",
                "a": "I would analyze user segmentation, look at feature usage drops, and check for any technical bugs or recent marketing changes.",
                "f": "What data points would you look at first?",
                "role": "Product Manager",
                "type": "Case Study",
                "difficulty": "Hard",
                "framework": "Problem Solving"
            }
        ]
        
        texts = []
        metadatas = []
        ids = []
        
        count = 0
        for bq in base_questions:
            for i in range(40): # Expands to 200 items for rich vector distribution
                count += 1
                q_text = f"Question: {bq['q']} (Variant {i})\nIdeal Answer: {bq['a']}\nFollow-up: {bq['f']}"
                meta = {
                    "role": bq["role"],
                    "type": bq["type"],
                    "difficulty": bq["difficulty"],
                    "framework": bq["framework"]
                }
                texts.append(q_text)
                metadatas.append(meta)
                ids.append(f"interview_{count}_{uuid.uuid4().hex[:6]}")
                
        self.vs.add_documents(config.COLLECTION_INTERVIEWS, texts, metadatas, ids)

    def _seed_trends(self):
        print("Seeding Industry Trends...")
        
        trends_data = [
            {
                "id": "trend_india_swe",
                "text": "India roles (LPA):\nSoftware Engineer: 3-8 (junior), 8-20 (mid), 20-50 (senior)",
                "meta": {"country": "India", "role": "Software Engineer"}
            },
            {
                "id": "trend_india_ds",
                "text": "India roles (LPA):\nData Scientist: 6-12 (junior), 12-25 (mid), 25-60 (senior)",
                "meta": {"country": "India", "role": "Data Scientist"}
            },
            {
                "id": "trend_india_pm",
                "text": "India roles (LPA):\nProduct Manager: 8-15 (junior), 15-35 (mid), 35-80 (senior)",
                "meta": {"country": "India", "role": "Product Manager"}
            },
            {
                "id": "trend_india_devops",
                "text": "India roles (LPA):\nDevOps Engineer: 4-10 (junior), 10-22 (mid), 22-50 (senior)",
                "meta": {"country": "India", "role": "DevOps Engineer"}
            },
            {
                "id": "trend_us_swe",
                "text": "US roles (USD annual):\nSoftware Engineer: 80k-120k (junior), 120k-180k (mid), 180k-300k (senior)",
                "meta": {"country": "US", "role": "Software Engineer"}
            },
            {
                "id": "trend_us_ds",
                "text": "US roles (USD annual):\nData Scientist: 90k-130k (junior), 130k-190k (mid), 190k-280k (senior)",
                "meta": {"country": "US", "role": "Data Scientist"}
            },
            {
                "id": "trend_us_pm",
                "text": "US roles (USD annual):\nProduct Manager: 100k-150k (junior), 150k-220k (mid), 220k-350k (senior)",
                "meta": {"country": "US", "role": "Product Manager"}
            },
            {
                "id": "trend_skills",
                "text": "TOP SKILLS 2025:\nMost in-demand: Python, GenAI/LLM, Cloud (AWS/GCP/Azure), React, Kubernetes, Data Engineering, Cybersecurity, Product Thinking, Communication",
                "meta": {"category": "Global Skills"}
            }
        ]
        
        texts = [t["text"] for t in trends_data]
        metadatas = [t["meta"] for t in trends_data]
        ids = [t["id"] for t in trends_data]
        
        self.vs.add_documents(config.COLLECTION_TRENDS, texts, metadatas, ids)

if __name__ == "__main__":
    pipeline = DataIngestionPipeline()
    pipeline.run_seeding()
