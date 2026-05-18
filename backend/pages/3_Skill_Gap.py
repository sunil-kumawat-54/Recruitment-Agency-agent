import streamlit as st
import plotly.graph_objects as go
from backend.agents.skill_gap_agent import SkillGapAgent

# Try mapping the local Chroma retriever
try:
    from backend.rag.retriever import retriever
except ImportError:
    retriever = None

st.set_page_config(page_title="Skill Gap Analyzer", page_icon="🗺️", layout="wide")

st.title("🗺️ AI Skill Gap & Learning Roadmap")
st.markdown("Map your current skills against your dream job and generate a step-by-step personalized learning path.")

# --- SIDEBAR: PARAMETERS ---
with st.sidebar:
    st.header("🎯 Target Goals")
    target_role = st.text_input("Target Role", value="Data Scientist")
    target_level = st.selectbox("Target Level", ["Junior", "Mid", "Senior", "Lead"])
    
    st.divider()
    st.header("⏳ Learning Constraints")
    timeline_months = st.slider("Timeline to be Job Ready (Months)", 1, 12, 6)
    hours_per_week = st.slider("Learning Commitment (Hours/Week)", 2, 40, 10)
    
    st.divider()
    st.header("🛠️ Current Skills")
    skills_input = st.text_area("Your Skills (comma separated)", "Python, SQL, Excel, basic Statistics")

# --- EXECUTION BUTTON ---
if st.button("Generate Learning Roadmap", type="primary"):
    current_skills_list = [s.strip() for s in skills_input.split(",") if s.strip()]
    
    if not current_skills_list:
        st.warning("Please enter at least one current skill.")
    elif not target_role:
        st.warning("Please specify a target role.")
    else:
        with st.spinner("Analyzing skill gaps and architecting learning roadmap..."):
            try:
                agent = SkillGapAgent(retriever=retriever)
                report = agent.analyze_gap(
                    current_skills=current_skills_list,
                    target_role=target_role,
                    target_level=target_level,
                    hours_per_week=hours_per_week,
                    timeline_months=timeline_months
                )
                
                st.success("Roadmap Architected Successfully!")
                
                # --- METRICS ROW ---
                col_m1, col_m2, col_m3 = st.columns(3)
                with col_m1:
                    st.metric("Readiness Level", report.get("readiness_level", "Unknown"))
                with col_m2:
                    st.metric("Gap Score", f"{report.get('gap_score', 0)} / 100")
                with col_m3:
                    st.metric("Estimated Time to Ready", report.get("time_to_ready", f"{timeline_months} months"))
                
                st.info(f"💡 **Coach's Note:** {report.get('motivational_message', '')}")
                st.divider()
                
                # --- VISUALIZATION & GAPS ROW ---
                viz_col, gaps_col = st.columns([1, 1])
                
                with viz_col:
                    st.subheader("Competency Radar")
                    radar_data = report.get("radar_chart_data", {})
                    categories = radar_data.get("categories", [])
                    current = radar_data.get("current_scores", [])
                    target = radar_data.get("target_scores", [])
                    
                    if categories and current and target:
                        fig = go.Figure()
                        fig.add_trace(go.Scatterpolar(
                            r=current,
                            theta=categories,
                            fill='toself',
                            name='Current Level',
                            line_color='#f43f5e' # brand-rose
                        ))
                        fig.add_trace(go.Scatterpolar(
                            r=target,
                            theta=categories,
                            fill='toself',
                            name='Target Expectation',
                            line_color='#10b981' # brand-emerald
                        ))
                        fig.update_layout(
                            polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                            showlegend=True,
                            paper_bgcolor="rgba(0,0,0,0)",
                            font=dict(color="white"),
                            margin=dict(t=30, b=30, l=30, r=30)
                        )
                        st.plotly_chart(fig, use_container_width=True)
                    else:
                        st.write("Radar chart data unavailable.")
                        
                with gaps_col:
                    st.subheader("⚠️ Critical Skill Gaps")
                    critical_gaps = report.get("critical_gaps", [])
                    for gap in critical_gaps:
                        with st.expander(f"{gap.get('skill', 'Unknown')} - Effort: {gap.get('effort_to_learn', 'N/A')}"):
                            st.write(f"**Why Needed:** {gap.get('why_needed', '')}")
                            st.markdown(f"✅ **Free Resource:** {gap.get('free_resource', 'N/A')}")
                            st.markdown(f"💳 **Paid Course:** {gap.get('paid_resource', 'N/A')}")

                st.divider()
                
                # --- LEARNING ROADMAP PHASES ---
                st.subheader(f"🗓️ {timeline_months}-Month Learning Roadmap")
                roadmap = report.get("learning_roadmap", [])
                
                for phase in roadmap:
                    st.markdown(f"### Phase {phase.get('phase', '')}: {phase.get('phase_name', '')}")
                    st.markdown(f"**Duration:** {phase.get('duration', '')}")
                    
                    r_col1, r_col2 = st.columns(2)
                    with r_col1:
                        st.markdown("**🧠 Skills to Master:**")
                        for s in phase.get("skills_to_learn", []):
                            st.markdown(f"- {s}")
                    with r_col2:
                        st.markdown("**📅 Weekly Tasks:**")
                        for t in phase.get("daily_tasks", []):
                            st.markdown(f"- {t}")
                            
                    st.info(f"🎯 **Milestone Check:** {phase.get('milestone', '')}")
                    st.success(f"📁 **Portfolio Project:** {phase.get('project_to_build', '')}")
                    st.markdown("---")
                    
                # --- EXPORT TO MARKDOWN ---
                export_str = f"# Skill Gap Roadmap for {target_role}\n\n"
                export_str += f"**Gap Score:** {report.get('gap_score', 0)}/100\n"
                export_str += f"**Estimated Time to Ready:** {report.get('time_to_ready', '')}\n\n"
                
                export_str += "## Critical Skill Gaps\n"
                for gap in critical_gaps:
                    export_str += f"- **{gap.get('skill', '')}**: {gap.get('why_needed', '')}\n"
                    export_str += f"  - Free Resource: {gap.get('free_resource', '')}\n"
                    
                export_str += "\n## Phase-by-Phase Roadmap\n"
                for p in roadmap:
                    export_str += f"### {p.get('phase_name', '')} ({p.get('duration', '')})\n"
                    export_str += f"- **Milestone**: {p.get('milestone', '')}\n"
                    export_str += f"- **Portfolio Project**: {p.get('project_to_build', '')}\n\n"
                
                st.download_button(
                    label="Download Roadmap (Markdown)",
                    data=export_str,
                    file_name=f"learning_roadmap_{target_role.replace(' ', '_')}.md",
                    mime="text/markdown"
                )
                
            except Exception as e:
                st.error(f"Failed to generate analysis: {e}")
