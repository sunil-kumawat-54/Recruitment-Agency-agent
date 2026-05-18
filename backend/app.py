import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import streamlit as st
from backend.rag.vectorstore import vector_store
from backend.rag.ingestion import DataIngestionPipeline

st.set_page_config(
    page_title="HireIQ — AI Recruitment Agency",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- INITIALIZE SESSION STATE ---
if "gemini_api_key" not in st.session_state:
    st.session_state.gemini_api_key = ""
if "user_type" not in st.session_state:
    st.session_state.user_type = "Job Seeker"
if "conversation_history" not in st.session_state:
    st.session_state.conversation_history = []
if "current_session" not in st.session_state:
    st.session_state.current_session = None

# --- SIDEBAR NAV ---
with st.sidebar:
    st.markdown("## 🤖 HireIQ")
    st.markdown("*Your AI Recruitment Agency*")
    
    st.divider()
    
    api_key = st.text_input("GEMINI_API_KEY", type="password", value=st.session_state.gemini_api_key)
    if api_key:
        st.session_state.gemini_api_key = api_key
        
    st.session_state.user_type = st.radio(
        "User Type", 
        ["Job Seeker", "Recruiter"], 
        index=0 if st.session_state.user_type == "Job Seeker" else 1
    )
    
    st.divider()
    st.markdown("### Navigation")
    st.page_link("app.py", label="Home Dashboard", icon="🏠")
    st.page_link("pages/1_Resume_Analyzer.py", label="Resume Analyzer", icon="📄")
    st.page_link("pages/2_Mock_Interview.py", label="Mock Interview", icon="🎤")
    st.page_link("pages/3_Skill_Gap.py", label="Skill Gap Mapper", icon="🗺️")
    st.page_link("pages/4_Job_Matching.py", label="Job Matcher", icon="🎯")
    st.page_link("pages/5_Salary_Negotiation.py", label="Salary Guide", icon="💰")
    st.page_link("pages/7_RAG_Admin.py", label="RAG Administration", icon="🗄️")
    
    st.divider()
    st.markdown("### Database Status")
    try:
        stats = vector_store.get_collection_stats()
        for k, v in stats.items():
            st.text(f"• {k}: {v} docs")
    except Exception:
        st.warning("DB Stats Unavailable")
        
    if st.button("Initialize Database"):
        with st.spinner("Seeding ChromaDB..."):
            pipeline = DataIngestionPipeline()
            pipeline.run_seeding()
            st.success("Database Seeded!")
            st.rerun()

# --- MAIN AREA ---
st.title("Welcome to HireIQ 🚀")
st.markdown(f"**Current Application Mode:** `{st.session_state.user_type}`")

st.info("Your centralized AI platform for mastering technical interviews, optimizing resumes, and matching with the perfect roles globally.")

# --- QUICK STATS ---
st.subheader("Knowledge Base Metrics")
try:
    c1, c2, c3 = st.columns(3)
    stats = vector_store.get_collection_stats()
    with c1:
        st.metric("Open Jobs Indexed", stats.get("job_descriptions", 0))
    with c2:
        st.metric("Interview Q&As", stats.get("interview_questions", 0))
    with c3:
        st.metric("Salary Market Data", stats.get("industry_trends", 0))
except Exception:
    st.write("Database not initialized yet.")

st.divider()

# --- AGENT STATUS CARDS ---
st.subheader("Agent System Status")
agents = [
    {"name": "Resume Analyzer", "desc": "ATS parser and optimizer", "ready": True},
    {"name": "Mock Interviewer", "desc": "Real-time AI Q&A feedback", "ready": True},
    {"name": "Skill Gap Mapper", "desc": "Learning path architect", "ready": True},
    {"name": "Job Matcher", "desc": "Semantic fit calculator", "ready": True},
    {"name": "Salary Negotiator", "desc": "Compensation strategist", "ready": True},
]

cols = st.columns(5)
for i, agent in enumerate(agents):
    with cols[i]:
        st.markdown(f"**{agent['name']}**")
        st.caption(agent['desc'])
        if agent['ready']:
            st.success("✅ Online")
        else:
            st.error("❌ Offline")

st.divider()

# --- GETTING STARTED ---
st.subheader("Getting Started")
st.markdown("""
1. **Set your API Key** securely in the sidebar.
2. Ensure the **Database Status** on the left shows active document counts. If not, click **Initialize Database**.
3. Use the **Navigation Menu** to activate any specialized agent logic.
4. **Recruiters:** Switch the user type in the sidebar to activate candidate batching workflows (coming soon).
""")
