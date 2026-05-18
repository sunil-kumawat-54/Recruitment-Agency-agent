import streamlit as st
import plotly.graph_objects as go
import json

from backend.agents.resume_analyzer import ResumeAnalyzerAgent
from backend.utils.pdf_parser import parse_resume_to_dict

# Load retriever if available
try:
    from backend.rag.retriever import retriever
except ImportError:
    retriever = None

st.set_page_config(page_title="Resume Analyzer", page_icon="📄", layout="wide")

st.title("📄 AI Resume Analyzer")
st.markdown("Upload your resume and provide a target role to get an elite ATS analysis.")

col_input1, col_input2 = st.columns([1, 1])

with col_input1:
    uploaded_file = st.file_uploader("Upload Resume", type=["pdf", "docx"])
with col_input2:
    target_role = st.text_input("Target Role", value="Software Engineer")

if st.button("Analyze Resume", type="primary"):
    if uploaded_file and target_role:
        with st.spinner("Analyzing resume against ATS algorithms..."):
            try:
                # Parse resume file bytes
                file_bytes = uploaded_file.read()
                parsed_data = parse_resume_to_dict(file_bytes, uploaded_file.name)
                resume_text = parsed_data.get("full_text", "")

                if not resume_text.strip():
                    st.error("Failed to extract text from the document. Please try a different file.")
                    st.stop()

                # Call Agent
                agent = ResumeAnalyzerAgent(retriever=retriever)
                report = agent.analyze(resume_text, target_role)

                # --- UI Rendering ---
                st.success("Analysis Complete!")

                # Overview Metrics
                col_m1, col_m2 = st.columns([1, 2])
                
                with col_m1:
                    score = report.get("ats_score", 0)
                    st.metric(label="ATS Score", value=f"{score}/100")
                    st.metric(label="Grade", value=report.get("grade", "N/A"))
                    
                    # Plotly Gauge
                    fig = go.Figure(go.Indicator(
                        mode="gauge+number",
                        value=score,
                        title={'text': "ATS Compatibility", 'font': {'size': 24}},
                        gauge={
                            'axis': {'range': [None, 100]},
                            'bar': {'color': "#6366f1"},  # brand-purple
                            'steps': [
                                {'range': [0, 50], 'color': "#f43f5e"},   # rose
                                {'range': [50, 75], 'color': "#f59e0b"},  # amber
                                {'range': [75, 100], 'color': "#10b981"}  # emerald
                            ],
                        }
                    ))
                    # Make background transparent
                    fig.update_layout(paper_bgcolor="rgba(0,0,0,0)", font={'color': "white"}, margin=dict(t=50, b=20, l=20, r=20))
                    st.plotly_chart(fig, use_container_width=True)

                with col_m2:
                    st.subheader("Summary Feedback")
                    st.info(report.get("summary_feedback", ""))

                    st.subheader("Section Scores")
                    section_scores = report.get("section_scores", {})
                    for sec, sc in section_scores.items():
                        st.progress(sc / 100.0, text=f"{sec.replace('_', ' ').title()}: {sc}/100")

                st.divider()

                # Keywords
                st.subheader("Keyword Match Analysis")
                kw_analysis = report.get("keyword_analysis", {})
                
                col_kw1, col_kw2 = st.columns(2)
                with col_kw1:
                    st.markdown("**✅ Found Keywords:**")
                    found = kw_analysis.get("found_keywords", [])
                    if found:
                        badges = " ".join([f"<span style='background-color:rgba(16,185,129,0.2); color:#10b981; padding:4px 8px; border-radius:4px; font-size:12px; margin:2px; display:inline-block;'>{kw}</span>" for kw in found])
                        st.markdown(badges, unsafe_allow_html=True)
                    else:
                        st.write("None")
                
                with col_kw2:
                    st.markdown("**❌ Missing Critical Keywords:**")
                    missing = kw_analysis.get("missing_critical_keywords", [])
                    if missing:
                        badges = " ".join([f"<span style='background-color:rgba(244,63,94,0.2); color:#f43f5e; padding:4px 8px; border-radius:4px; font-size:12px; margin:2px; display:inline-block;'>{kw}</span>" for kw in missing])
                        st.markdown(badges, unsafe_allow_html=True)
                    else:
                        st.write("None")

                st.divider()

                # Insights Cards
                col_c1, col_c2, col_c3 = st.columns(3)
                
                with col_c1:
                    st.markdown("### 🌟 Strengths")
                    for s in report.get("strengths", []):
                        st.success(f"• {s}")
                
                with col_c2:
                    st.markdown("### ⚠️ Critical Improvements")
                    for c in report.get("critical_improvements", []):
                        st.error(f"• {c}")
                        
                with col_c3:
                    st.markdown("### 💡 Quick Wins")
                    for q in report.get("quick_wins", []):
                        st.warning(f"• {q}")

                st.divider()
                
                # Download Button
                json_data = json.dumps(report, indent=2)
                st.download_button(
                    label="Download Report (JSON)",
                    data=json_data,
                    file_name=f"resume_analysis_{target_role.replace(' ', '_')}.json",
                    mime="application/json"
                )

            except Exception as e:
                st.error(f"An error occurred during analysis: {e}")
    else:
        st.warning("Please upload a resume file and specify a target role.")
