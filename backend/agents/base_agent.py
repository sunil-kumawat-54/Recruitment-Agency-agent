import time
import json
import logging
from abc import ABC, abstractmethod
import google.generativeai as genai
from backend.config import config
from backend.utils.helpers import strip_json_markdown

# Configure basic logging for agents
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("BaseAgent")

class BaseAgent(ABC):
    def __init__(self, gemini_model: str = config.GEMINI_MODEL, retriever = None):
        self.model_name = gemini_model
        self.retriever = retriever
        
        # Determine active API Key (Fallback to .env if Streamlit UI is empty)
        import os
        active_api_key = os.getenv("GEMINI_API_KEY")
        if not active_api_key:
            active_api_key = ""
        try:
            import streamlit as st
            if "gemini_api_key" in st.session_state and st.session_state.gemini_api_key:
                active_api_key = st.session_state.gemini_api_key
        except ImportError:
            pass

        # Configure Gemini Client
        if active_api_key:
            genai.configure(api_key=active_api_key)
        self.model = genai.GenerativeModel(self.model_name)

    @abstractmethod
    def process(self, input_data: dict) -> dict:
        """Abstract execution method to be overridden by specialized agents."""
        pass

    def _call_gemini(self, prompt: str, system_instruction: str = None) -> str:
        """Invokes Gemini Flash API content generation with exponential rate limit backoff retries."""
        logger.info(f"Triggering generation call on model {self.model_name}...")
        
        max_retries = 3
        backoff_seconds = 2
        
        for attempt in range(max_retries):
            try:
                # Custom generative configuration setting response schemas or instructions
                active_model = self.model
                if system_instruction:
                    active_model = genai.GenerativeModel(
                        model_name=self.model_name,
                        system_instruction=system_instruction
                    )
                
                response = active_model.generate_content(prompt)
                if response and response.text:
                    logger.info("Generation pass succeeded!")
                    return response.text
                raise ValueError("API returned an empty or invalid content response block.")
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed with error: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in {backoff_seconds} seconds...")
                    time.sleep(backoff_seconds)
                    backoff_seconds *= 2
                else:
                    logger.error("All Gemini API connection limits exhausted.")
                    raise e
        return ""

    def _retrieve_context(self, query: str, collection: str) -> str:
        """Pulls closest semantic context documents from persistent vector stores."""
        if not self.retriever:
            logger.warning("No retriever mapped to this agent instance.")
            return "No historical documents found in vectorstore."
        
        try:
            return self.retriever.retrieve_formatted_context(query, collection)
        except Exception as e:
            logger.error(f"RAG Retrieval failed: {e}")
            return "RAG indexing database currently unavailable."

    def _parse_json_response(self, response: str) -> dict:
        """Strips markdown ```json fences and returns a parsed dictionary."""
        cleaned = strip_json_markdown(response)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as err:
            logger.error(f"JSON parsing failed for string: {cleaned}. Error: {err}")
            # Attempt a secondary regex check if brackets are mismatched
            try:
                start_idx = cleaned.find("{")
                end_idx = cleaned.rfind("}")
                if start_idx != -1 and end_idx != -1:
                    candidate = cleaned[start_idx:end_idx + 1]
                    return json.loads(candidate)
            except Exception:
                pass
            raise err
