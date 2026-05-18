import streamlit as st
import time
from backend.rag.ingestion import DataIngestionPipeline
from backend.rag.vectorstore import vector_store
from backend.config import config

st.set_page_config(page_title="RAG Administration", page_icon="🗄️", layout="wide")

st.title("🗄️ Database & Vector Store Administration")
st.markdown("Manage ChromaDB embeddings, re-seed hardcoded datasets, and test semantic retrieval.")

# --- PASSWORD PROTECTION ---
if "admin_auth" not in st.session_state:
    st.session_state.admin_auth = False

if not st.session_state.admin_auth:
    pwd = st.text_input("Enter Admin Password to Unlock Database Controls", type="password")
    if st.button("Login"):
        if pwd == "admin":  # Default simple protection
            st.session_state.admin_auth = True
            st.rerun()
        else:
            st.error("Incorrect password.")
    st.stop()

if st.sidebar.button("Logout Session"):
    st.session_state.admin_auth = False
    st.rerun()

# --- DIAGNOSTICS STATS ---
st.sidebar.header("System Diagnostics")
stats = vector_store.get_collection_stats()
st.sidebar.write("**Vector Store Document Counts:**")
st.sidebar.json(stats)

# --- 1. SEEDING ---
st.header("1. Core Seeding Pipeline")
if st.button("Initialize / Reseed Database", type="primary"):
    with st.spinner("Flushing and re-seeding active collections (this might take a few moments)..."):
        try:
            pipeline = DataIngestionPipeline()
            pipeline.run_seeding()
            st.success("Seeding Pipeline completed successfully!")
            st.rerun()
        except Exception as e:
            st.error(f"Seeding failed: {e}")

st.divider()

# --- 2. CUSTOM UPLOADS ---
st.header("2. Custom Ingestion")
col1, col2 = st.columns(2)
with col1:
    st.subheader("Add Job Descriptions")
    jd_file = st.file_uploader("Upload JD (PDF/JSON)", key="jd_up")
    if st.button("Ingest Job Description"):
        if jd_file:
            st.info("Custom JD ingestion sequence triggered.")
        else:
            st.warning("Select a file first.")
with col2:
    st.subheader("Add Interview Questions")
    q_file = st.file_uploader("Upload Questions (CSV/JSON)", key="q_up")
    if st.button("Ingest Questions"):
        if q_file:
            st.info("Custom Question ingestion sequence triggered.")
        else:
            st.warning("Select a file first.")

st.divider()

# --- 3. RETRIEVAL TESTER ---
st.header("3. Semantic Retrieval Sandbox")
test_col = st.selectbox("Target Collection", [
    config.COLLECTION_JOBS, 
    config.COLLECTION_INTERVIEWS, 
    config.COLLECTION_TRENDS, 
    config.COLLECTION_RESUMES
])
test_query = st.text_input("Search Query")

if st.button("Test Retrieval"):
    if test_query:
        with st.spinner("Fetching semantic neighbors..."):
            results = vector_store.query(test_col, test_query, n_results=5)
            if results:
                for idx, r in enumerate(results):
                    with st.expander(f"Result {idx+1} (Semantic Distance: {r.get('distance', 0):.4f})"):
                        st.json(r.get('metadata', {}))
                        st.write(r.get('document', ''))
            else:
                st.warning("No matches found.")

st.divider()

# --- 4. DANGER ZONE ---
st.header("4. Danger Zone")
if st.button("Drop All Collections", type="secondary"):
    st.warning("Are you sure? Click below to confirm irreversible vector deletion.")
    
if st.button("🚨 CONFIRM DROP COLLECTIONS", type="primary"):
    with st.spinner("Dropping vectors..."):
        try:
            for coll in [config.COLLECTION_JOBS, config.COLLECTION_INTERVIEWS, config.COLLECTION_TRENDS, config.COLLECTION_RESUMES]:
                vector_store.delete_collection(coll)
            st.success("All collections successfully dropped.")
            st.rerun()
        except Exception as e:
            st.error(f"Drop failed: {e}")
