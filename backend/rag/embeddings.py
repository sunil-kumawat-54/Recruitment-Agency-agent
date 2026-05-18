import google.generativeai as genai
from chromadb import EmbeddingFunction, Documents, Embeddings
from backend.config import config

class GeminiEmbeddingFunction(EmbeddingFunction):
    def __init__(self, api_key: str = None, model_name: str = config.GEMINI_EMBED_MODEL):
        self.model_name = model_name
        if api_key or config.GEMINI_API_KEY:
            genai.configure(api_key=api_key or config.GEMINI_API_KEY)

    def __call__(self, input: Documents) -> Embeddings:
        """Required ChromaDB EmbeddingFunction interface."""
        return embed_documents(list(input), self.model_name)

def embed_documents(texts: list[str], model_name: str = config.GEMINI_EMBED_MODEL) -> list[list[float]]:
    """Generates embeddings for a batch of documents with Gemini models/embedding-001."""
    if not texts:
        return []
    
    # Batch processing in small sets to avoid rate bounds
    embeddings = []
    batch_size = 20
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        try:
            response = genai.embed_content(
                model=model_name,
                content=batch,
                task_type="retrieval_document"
            )
            embeddings.extend(response['embedding'])
        except Exception as e:
            print(f"[Embedding Error] Failed to generate embedding for batch: {e}")
            # Fallback zero-embedding vector in case of connection limits (dimension 768 for embedding-001)
            fallback = [0.0] * 768
            embeddings.extend([fallback] * len(batch))
            
    return embeddings

def embed_query(text: str, model_name: str = config.GEMINI_EMBED_MODEL) -> list[float]:
    """Generates embedding for a single query text."""
    try:
        response = genai.embed_content(
            model=model_name,
            content=text,
            task_type="retrieval_query"
        )
        return response['embedding']
    except Exception as e:
        print(f"[Query Embedding Error] Failed to generate query embedding: {e}")
        return [0.0] * 768
