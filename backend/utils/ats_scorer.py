import re

class ATSScorer:
    def __init__(self):
        self.COMMON_ATS_KEYWORDS = {
            "software engineer": ["python", "java", "c++", "react", "node", "sql", "aws", "docker", "kubernetes", "agile", "git", "api"],
            "data scientist": ["python", "r", "sql", "machine learning", "deep learning", "nlp", "pandas", "tensorflow", "pytorch", "statistics"],
            "product manager": ["agile", "scrum", "roadmap", "jira", "user research", "a/b testing", "kpi", "go-to-market", "stakeholder"],
            "marketing manager": ["seo", "sem", "content marketing", "google analytics", "crm", "campaign", "social media", "roi"],
            "hr manager": ["onboarding", "recruitment", "talent acquisition", "employee relations", "payroll", "performance management", "workday"]
        }
        
        self.ACTION_VERBS = [
            "achieved", "improved", "managed", "created", "resolved", "led", "developed", 
            "increased", "decreased", "spearheaded", "orchestrated", "optimized", "launched",
            "implemented", "designed", "engineered", "delivered", "mentored"
        ]

    def _keyword_density(self, text: str, keywords: list) -> float:
        text_lower = text.lower()
        found_count = sum(1 for kw in keywords if kw.lower() in text_lower)
        if not keywords:
            return 0.0
        return (found_count / len(keywords)) * 100.0

    def _check_formatting(self, text: str) -> dict:
        has_phone = bool(re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text))
        has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text))
        has_linkedin = bool(re.search(r'linkedin\.com/in/[\w-]+', text, re.IGNORECASE))
        has_dates = bool(re.search(r'(20\d{2}|19\d{2})', text))
        
        score = 0
        if has_phone: score += 25
        if has_email: score += 25
        if has_linkedin: score += 25
        if has_dates: score += 25
        
        return {
            "has_phone": has_phone,
            "has_email": has_email,
            "has_linkedin": has_linkedin,
            "has_dates": has_dates,
            "formatting_score": score
        }

    def _count_action_verbs(self, text: str) -> int:
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b', text_lower)
        return sum(1 for verb in self.ACTION_VERBS if verb in words)

    def _check_quantification(self, text: str) -> bool:
        # Matches formats like 10, 50%, $1M, 20x
        return bool(re.search(r'\b\d+\b|\d+%|\$\d+|\d+x', text))

    def _calculate_readability(self, text: str) -> float:
        words = len(re.findall(r'\b\w+\b', text))
        sentences = len(re.findall(r'[.!?]+', text))
        
        if sentences == 0: return 50.0
        
        words_per_sentence = words / sentences
        
        if 10 <= words_per_sentence <= 25:
            return 100.0
        elif words_per_sentence < 10:
            return 80.0
        else:
            return max(0.0, 100.0 - (words_per_sentence - 25) * 2)

    def score_resume(self, resume_text: str, job_description: str) -> dict:
        text_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        # 1. Formatting 
        fmt_details = self._check_formatting(resume_text)
        
        # 2. Dynamic Keyword Match Extraction (based on words > 3 chars in JD)
        job_words = set(re.findall(r'\b\w{4,}\b', job_lower))
        resume_words = set(re.findall(r'\b\w{4,}\b', text_lower))
        common_words = job_words.intersection(resume_words)
        
        kw_score = 0.0
        if job_words:
            kw_score = (len(common_words) / len(job_words)) * 100.0
            kw_score = min(100.0, kw_score * 1.5) # Curve boost as perfect matching is unlikely
            
        # 3. Action Verbs Impact
        action_verb_count = self._count_action_verbs(resume_text)
        action_verb_score = min(100.0, (action_verb_count / 10.0) * 100)
        
        # 4. Quantification & Numbers
        has_metrics = self._check_quantification(resume_text)
        quant_score = 100.0 if has_metrics else 30.0
        
        # 5. Semantic Readability
        readability_score = self._calculate_readability(resume_text)
        
        # Final Algorithm Mapping Weight
        final_score = (
            (kw_score * 0.40) +
            (fmt_details["formatting_score"] * 0.20) +
            (action_verb_score * 0.15) +
            (quant_score * 0.15) +
            (readability_score * 0.10)
        )
        
        # Normalizing grade
        grade = "A+" if final_score >= 90 else "A" if final_score >= 80 else "B" if final_score >= 70 else "C" if final_score >= 60 else "D"
        
        return {
            "ats_score": int(final_score),
            "grade": grade,
            "section_scores": {
                "keyword_match": int(kw_score),
                "formatting": int(fmt_details["formatting_score"]),
                "action_verbs": int(action_verb_score),
                "quantification": int(quant_score),
                "readability": int(readability_score)
            },
            "metrics": {
                "action_verb_count": action_verb_count,
                "has_quantifiable_metrics": has_metrics,
                "formatting_details": fmt_details
            }
        }
