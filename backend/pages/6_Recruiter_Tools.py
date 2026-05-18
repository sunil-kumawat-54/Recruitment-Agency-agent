import streamlit as st
import os
import sys
import pandas as pd
import google.generativeai as genai

# Ensure parent directory is in Python path for local imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.utils.pdf_parser import parse_resume_to_dict
from backend.utils.ats_scorer import ATSScorer

ats_scorer_instance = ATSScorer()
from backend.agents.resume_analyzer import ResumeAnalyzerAgent
from backend.utils.helpers import logger
from backend.config import config

st.set_page_config(page_title="Recruiter Workspace — HireIQ", page_icon="💼", layout="wide")

st.markdown("<h1 style='color: #4f46e5;'>💼 AI Recruiter & Pipeline Workspace</h1>", unsafe_allow_html=True)
st.markdown("##### Conduct bulk candidate screening, view matching leaderboards, and discuss pipelines with your unified AI Recruitment Advisor.")

st.divider()

# Session State for bulk files
if "bulk_candidates" not in st.session_state:
    st.session_state["bulk_candidates"] = []
if "bulk_job_description" not in st.session_state:
    st.session_state["bulk_job_description"] = ""
if "recruiter_chat_history" not in st.session_state:
    st.session_state["recruiter_chat_history"] = []

tab_bulk, tab_advise = st.tabs(["📋 Bulk ATS Screening", "💬 AI Candidate Discussion"])

with tab_bulk:
    st.write("### Bulk Screening Pipeline")
    
    col_jd, col_files = st.columns([1, 1])
    
    with col_jd:
        bulk_jd = st.text_area("Paste Target Job Description (used for keyword density comparisons)", value=st.session_state["bulk_job_description"], height=200, placeholder="Paste job description requirements...")
        target_pos = st.text_input("Target Job Position Title", value="Software Engineer")
        st.session_state["bulk_job_description"] = bulk_jd
        
    with col_files:
        uploaded_resumes = st.file_uploader("Upload Resumes (PDF or DOCX - Multiple Allowed)", type=["pdf", "docx"], accept_multiple_files=True)
        
    if st.button("🚀 Screen Candidates", type="primary", disabled=(not uploaded_resumes or not bulk_jd.strip())):
        with st.spinner("Processing bulk resumes..."):
            st.session_state["bulk_candidates"] = []
            
            for resume_file in uploaded_resumes:
                filename = resume_file.name
                file_bytes = resume_file.read()
                
                try:
                    # 1. Parse resume
                    parsed = parse_resume_to_dict(file_bytes, filename)
                    
                    # Estimate name from filename
                    candidate_name = filename.split('.')[0].replace('_', ' ').replace('-', ' ').title()
                    
                    # 2. Score resume quickly via ATSScorer first
                    score_report = ats_scorer_instance.score_resume(
                        resume_text=parsed["full_text"],
                        job_description=bulk_jd
                    )
                    
                    # Save results
                    st.session_state["bulk_candidates"].append({
                        "name": candidate_name,
                        "filename": filename,
                        "text": parsed["full_text"],
                        "ats_score": score_report["ats_score"],
                        "grade": score_report["grade"],
                        "found_keywords": score_report["keyword_analysis"]["found_keywords"],
                        "missing_keywords": score_report["keyword_analysis"]["missing_critical_keywords"],
                        "report": score_report
                    })
                except Exception as ex:
                    st.error(f"Error parsing `{filename}`: {str(ex)}")
                    
            st.success(f"Successfully screened {len(st.session_state['bulk_candidates'])} candidates!")
            st.rerun()
            
    # Display Leaderboard Table
    if st.session_state["bulk_candidates"]:
        st.divider()
        st.write("### 🏆 Candidate Match Leaderboard")
        
        # Format table data
        rows = []
        for idx, cand in enumerate(st.session_state["bulk_candidates"]):
            rows.append({
                "Rank": idx + 1,
                "Candidate Name": cand["name"],
                "ATS Match Score": cand["ats_score"],
                "Grade": cand["grade"],
                "Matching Skills": ", ".join(cand["found_keywords"][:5]),
                "File name": cand["filename"]
            })
            
        df = pd.DataFrame(rows)
        # Sort by score descending
        df = df.sort_values(by="ATS Match Score", ascending=False)
        # Reset Rank indices
        df["Rank"] = range(1, len(df) + 1)
        
        st.dataframe(df, use_container_width=True, hide_index=True)
        
        # Detail review expandable cards
        st.write("### 🔍 Individual Candidate Scorecards")
        for cand in st.session_state["bulk_candidates"]:
            with st.expander(f"👤 **{cand['name']}** — Score: `{cand['ats_score']}%` ({cand['grade']})"):
                st.write(f"**Filename**: {cand['filename']}")
                
                # Render short stats
                sc_col1, sc_col2 = st.columns(2)
                with sc_col1:
                    st.write(f"**Action Verbs**: {', '.join(cand['report']['action_verbs_used'][:5])}")
                    st.write(f"**Word Count**: {cand['report']['word_count']} words")
                with sc_col2:
                    st.write("**Top Missing Keywords**:")
                    st.write(", ".join([f":red[`{m}`]" for m in cand["missing_keywords"][:5]]))
                    
                if st.button("🧬 Trigger LLM Deep Analysis", key=f"llm_{cand['filename']}"):
                    with st.spinner("Generating LLM comprehensive scorecard..."):
                        agent = ResumeAnalyzerAgent()
                        llm_rep = agent.process({
                            "resume_text": cand["text"],
                            "target_role": target_pos
                        })
                        st.write("##### 📑 Unified LLM Report")
                        st.info(llm_rep.get("summary_feedback"))
                        st.write("**Strengths**:", ", ".join(llm_rep.get("strengths", [])))
                        st.write("**Critical Gaps**:", ", ".join(llm_rep.get("critical_improvements", [])))
                        
with tab_advise:
    st.write("### AI Pipeline Advisor Chat")
    st.write("Discuss your screened pipeline with HireIQ. Ask comparative questions like *'Which candidate has more experience with Kubernetes?'* or *'Summarize the fit of our top candidate.'*")
    
    if not st.session_state["bulk_candidates"]:
        st.warning("Please upload and screen candidates in the 'Bulk ATS Screening' tab first to populate your advisor context.")
    else:
        # Display Chat Logs
        for msg in st.session_state["recruiter_chat_history"]:
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])
                
        # Handle chat entries
        chat_prompt = st.chat_input("Ask about candidate comparisons or details...")
        
        if chat_prompt:
            # Display user bubble
            with st.chat_message("user"):
                st.markdown(chat_prompt)
            st.session_state["recruiter_chat_history"].append({"role": "user", "content": chat_prompt})
            
            # Formulate full candidate roster string for Gemini API Context
            roster_context = "Here is the active pipeline of screened candidates for the role:\n"
            for cand in st.session_state["bulk_candidates"]:
                roster_context += (
                    f"--- Candidate: {cand['name']} ---\n"
                    f"ATS Score: {cand['ats_score']} | Grade: {cand['grade']}\n"
                    f"Top Skills possess: {cand['found_keywords']}\n"
                    f"Core Resume Content:\n{cand['text'][:4000]}...\n\n"
                )
                
            full_prompt = f"""
            You are a chief recruitment architect advisor. Use the following candidate database roster context to answer the recruiter query.
            
            ROSTER CONTEXT:
            {roster_context}
            
            TARGET JOB POSITION DESCRIPTION:
            {st.session_state["bulk_job_description"]}
            
            RECRUITER QUERY:
            {chat_prompt}
            
            Answer the recruiter clearly, listing candidate comparisons or profiles. Be objective, precise, and professional.
            """
            
            with st.chat_message("assistant"):
                with st.spinner("Consulting pipeline advisor..."):
                    try:
                        # Call LLM directly using Gemini
                        if config.GEMINI_API_KEY:
                            genai.configure(api_key=config.GEMINI_API_KEY)
                            model = genai.GenerativeModel(config.GEMINI_MODEL)
                            response = model.generate_content(full_prompt)
                            ans_text = response.text
                        else:
                            ans_text = "Google Gemini Key is not configured in settings. Cannot analyze comparisons."
                    except Exception as e:
                        ans_text = f"Error consulting advisory agents: {str(e)}"
                        
                    st.markdown(ans_text)
                    st.session_state["recruiter_chat_history"].append({"role": "assistant", "content": ans_text})
