import chromadb
from backend.config import config
from backend.rag.embeddings import GeminiEmbeddingFunction

class VectorStoreManager:
    def __init__(self):
        # Create persistent client directory
        self.client = chromadb.PersistentClient(path=config.CHROMA_DB_PATH)
        self.embedding_fn = GeminiEmbeddingFunction()

    def get_or_create_collection(self, name: str):
        """Initializes or fetches a collection mapped to the Google Gemini embedding function."""
        return self.client.get_or_create_collection(
            name=name,
            embedding_function=self.embedding_fn
        )

    def add_documents(self, collection_name: str, texts: list[str], metadatas: list[dict], ids: list[str]):
        """Ingests a list of document strings with custom metadata attributes."""
        if not texts:
            return
        
        collection = self.get_or_create_collection(collection_name)
        collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )

    def query(self, collection_name: str, query_text: str, n_results: int = 5) -> list[dict]:
        """Queries the persistent collection for the top N semantically matching records."""
        collection = self.get_or_create_collection(collection_name)
        
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        
        formatted_results = []
        if results and 'documents' in results and results['documents']:
            documents = results['documents'][0]
            metadatas = results['metadatas'][0] if results.get('metadatas') else [{}] * len(documents)
            ids = results['ids'][0] if results.get('ids') else []
            distances = results['distances'][0] if results.get('distances') else [0.0] * len(documents)
            
            for i in range(len(documents)):
                formatted_results.append({
                    "id": ids[i] if i < len(ids) else f"doc_{i}",
                    "document": documents[i],
                    "metadata": metadatas[i],
                    "distance": distances[i]
                })
        return formatted_results

    def delete_collection(self, name: str):
        """Drops a collection from the persistent database client."""
        try:
            self.client.delete_collection(name)
        except Exception as e:
            print(f"[Chroma delete warn] {e}")

    def get_collection_stats(self) -> dict:
        """Counts the active document records in each specialized repository collection."""
        stats = {}
        collections = [
            config.COLLECTION_JOBS,
            config.COLLECTION_INTERVIEWS,
            config.COLLECTION_RESUMES,
            config.COLLECTION_TRENDS
        ]
        for name in collections:
            try:
                coll = self.client.get_collection(name, embedding_function=self.embedding_fn)
                stats[name] = coll.count()
            except Exception:
                stats[name] = 0
        return stats

vector_store = VectorStoreManager()
