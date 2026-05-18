from backend.rag.vectorstore import vector_store
from backend.config import config

class RetrievalEngine:
    def __init__(self):
        self.vs = vector_store

    def _format_docs(self, docs: list) -> str:
        if not docs:
            return "No relevant context found in database."
        return "\n\n".join([d.get("document", "") for d in docs])

    def retrieve_for_resume_analysis(self, job_role: str) -> str:
        res = self.vs.query(config.COLLECTION_JOBS, job_role, n_results=config.TOP_K)
        return self._format_docs(res)

    def retrieve_for_interview(self, role: str, round_type: str) -> str:
        query = f"{role} {round_type} interview questions"
        res = self.vs.query(config.COLLECTION_INTERVIEWS, query, n_results=config.TOP_K * 2)
        return self._format_docs(res)

    def retrieve_for_skill_gap(self, target_role: str) -> str:
        res = self.vs.query(config.COLLECTION_JOBS, target_role, n_results=config.TOP_K)
        return self._format_docs(res)

    def retrieve_for_job_matching(self, candidate_skills: list, location: str) -> str:
        skills_str = " ".join(candidate_skills) if isinstance(candidate_skills, list) else str(candidate_skills)
        query = f"{skills_str} {location}"
        res = self.vs.query(config.COLLECTION_JOBS, query, n_results=config.TOP_K * 2)
        return self._format_docs(res)

    def retrieve_salary_data(self, role: str, location: str) -> str:
        query = f"{role} salary trends {location}"
        res = self.vs.query(config.COLLECTION_TRENDS, query, n_results=config.TOP_K)
        return self._format_docs(res)

    # General fallback for BaseAgent abstraction
    def retrieve_formatted_context(self, query: str, collection: str) -> str:
        res = self.vs.query(collection, query, n_results=config.TOP_K)
        return self._format_docs(res)

retriever = RetrievalEngine()
