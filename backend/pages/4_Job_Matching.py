import streamlit as st
from backend.agents.job_matching_agent import JobMatchingAgent

# Try mapping the local Chroma retriever
try:
    from backend.rag.retriever import retriever
except ImportError:
    retriever = None

st.set_page_config(page_title="Job Matcher", page_icon="🎯", layout="wide")

st.title("🎯 AI Job Matcher")
st.markdown("Scan the active market for roles that semantically match your unique profile.")

# --- SIDEBAR: PARAMETERS ---
with st.sidebar:
    st.header("👤 Your Profile")
    current_role = st.text_input("Current/Target Role", "Software Engineer")
    skills = st.text_area("Core Skills", "Python, AWS, React, Docker")
    experience = st.number_input("Years of Experience", 0, 30, 3)
    location = st.text_input("Location Preference", "Bangalore, Remote")
    expected_salary = st.text_input("Expected CTC", "20 LPA")

# --- EXECUTION BUTTON ---
if st.button("Scan Compatible Openings", type="primary"):
    with st.spinner("Analyzing semantic matches against active seed vacancies..."):
        try:
            agent = JobMatchingAgent(retriever=retriever)
            report = agent.find_matches({
                "skills": skills,
                "experience": experience,
                "current_role": current_role,
                "location": location,
                "expected_salary": expected_salary,
                "education": "Not Specified"
            })
            
            st.success("Matching Complete!")
            
            # Overview Metrics
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Total Matches Discovered", report.get("total_matches", 0))
            with col2:
                st.metric("Market Demand Fit", report.get("market_demand", "N/A"))
                
            st.divider()
            
            # Match Listings
            st.subheader("🏆 Top Matching Roles")
            for match in report.get("top_matches", []):
                with st.container():
                    st.markdown(f"### {match.get('job_title', 'Role')} at {match.get('company', 'Company')}")
                    
                    c1, c2, c3 = st.columns(3)
                    with c1:
                        st.markdown(f"**📍 Location:** {match.get('location', 'N/A')}")
                    with c2:
                        st.markdown(f"**💰 Comp:** {match.get('salary_range', 'N/A')}")
                    with c3:
                        match_pct = match.get('match_percentage', 0)
                        color = "green" if match_pct >= 80 else "orange" if match_pct >= 60 else "red"
                        st.markdown(f"**🎯 Match:** :{color}[**{match_pct}%**]")
                        
                    st.info(f"**Why this fits:** {match.get('why_this_job', '')}")
                    
                    with st.expander("Show Application Strategy"):
                        st.write("**Concerns to address in interview:**")
                        for c in match.get("potential_concerns", []):
                            st.write(f"- {c}")
                        st.markdown(f"**💡 Tip:** {match.get('application_tip', '')}")
                        
                    st.markdown("---")
            
            # Resume Advice
            st.subheader("📝 Recommended Resume Tweaks")
            for tweak in report.get("recommended_resume_tweaks", []):
                st.success(f"• {tweak}")
                
        except Exception as e:
            st.error(f"Failed to fetch job matches: {e}")
