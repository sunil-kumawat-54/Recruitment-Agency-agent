import streamlit as st
import os
import sys

# Ensure parent directory is in Python path for local imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agents.salary_agent import SalaryNegotiationAgent
from backend.utils.helpers import logger

st.set_page_config(page_title="Salary Guide — HireIQ", page_icon="💰", layout="wide")

st.markdown("<h1 style='color: #4f46e5;'>💰 AI Salary & Negotiation Guide Agent</h1>", unsafe_allow_html=True)
st.markdown("##### Research live industry salary bands, analyze your market valuation, and build professional counter-offer scripts and emails.")

st.divider()

# Inputs
st.write("### Review Your Market CTC Compensation")
col_sc1, col_sc2 = st.columns(2)

with col_sc1:
    role = st.text_input("Target Career Role", value="Software Engineer")
    years_experience = st.number_input("Years of Experience", min_value=0, max_value=30, value=3)
    location = st.text_input("Location (City / Country)", value="Bangalore")
    skills = st.text_input("Core Skills (comma-separated)", value="Python, FastAPI, SQL, Git")
    
with col_sc2:
    current_ctc = st.text_input("Current Salary (CTC) (Optional)", placeholder="e.g. 10 LPA")
    received_offer = st.text_input("Received Offer (CTC) (Optional)", placeholder="e.g. 15 LPA")

if st.button("🚀 Analyze Salary Strategy", type="primary"):
    with st.spinner("Analyzing compensation benchmarks and negotiation scripts..."):
        try:
            agent = SalaryNegotiationAgent()
            report = agent.process({
                "role": role,
                "years_experience": years_experience,
                "location": location,
                "skills": skills,
                "current_ctc": current_ctc,
                "received_offer": received_offer
            })
            
            if "error" in report:
                st.error(report["error"])
            else:
                st.success("Salary Strategy guide compiled successfully!")
                
                # Overall Verdict Metrics
                mcol1, mcol2, mcol3 = st.columns(3)
                
                curr = report.get("market_salary_range", {}).get("currency", "INR")
                
                with mcol1:
                    verdict = report.get("negotiation_verdict", "At Market")
                    if verdict in ["Underpaid"]: v_color = "#ef4444"
                    elif verdict in ["Overpaid", "Fairly Paid"]: v_color = "#10b981"
                    else: v_color = "#f59e0b"
                    
                    st.markdown(f"""
                    <div style="background-color: #0f172a; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; text-align: center;">
                        <div style="font-size: 0.875rem; color: #94a3b8; text-transform: uppercase;">Negotiation Verdict</div>
                        <div style="font-size: 2.25rem; font-weight: 700; color: {v_color}; line-height: 1.6;">{verdict}</div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                with mcol2:
                    st.markdown(f"""
                    <div style="background-color: #0f172a; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; text-align: center;">
                        <div style="font-size: 0.875rem; color: #94a3b8; text-transform: uppercase;">Your Calculated Market Value</div>
                        <div style="font-size: 2.25rem; font-weight: 700; color: #10b981; line-height: 1.6;">{report.get('your_market_value'):,} {curr}</div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                with mcol3:
                    st.markdown(f"""
                    <div style="background-color: #0f172a; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; text-align: center;">
                        <div style="font-size: 0.875rem; color: #94a3b8; text-transform: uppercase;">Recommended Asking Anchor</div>
                        <div style="font-size: 2.25rem; font-weight: 700; color: #4f46e5; line-height: 1.6;">{report.get('recommended_ask'):,} {curr}</div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                st.divider()
                
                # Market Range and Strategy
                range_col, strat_col = st.columns([1, 1])
                
                with range_col:
                    st.markdown("#### 📊 Market Salary Range Benchmarks")
                    r_data = report.get("market_salary_range", {})
                    st.write(f"- Minimum: **{r_data.get('minimum', 0):,} {curr}**")
                    st.write(f"- Median: **{r_data.get('median', 0):,} {curr}**")
                    st.write(f"- Maximum: **{r_data.get('maximum', 0):,} {curr}**")
                    st.write(f"- Market Salary Trend: **{report.get('market_trend')}**")
                    st.write(f"- Confidence Level: **{report.get('confidence_level')}**")
                    
                with strat_col:
                    st.markdown("#### 🎯 Active Negotiation Strategy")
                    strat = report.get("negotiation_strategy", {})
                    st.write(f"- Strategy: **{strat.get('strategy_name')}**")
                    st.write(f"- Opening Anchor Number: **{strat.get('opening_number', 0):,} {curr}**")
                    st.write(f"- Ideal target outcome: **{strat.get('ideal_outcome', 0):,} {curr}**")
                    st.write(f"- Walkaway absolute minimum: **{strat.get('minimum_acceptable', 0):,} {curr}**")
                    
                st.divider()
                
                # Phrases and email templates
                col_ph, col_email = st.columns([1, 1])
                
                with col_ph:
                    st.markdown("##### 💬 Talking Points & Phrases")
                    st.write("**Key Value talking points:**")
                    for tp in report.get("talking_points", []):
                        st.write(f"- 📢 {tp}")
                        
                    st.write("**Exact phrases to say:**")
                    for say in report.get("phrases_to_use", []):
                        st.write(f"- 🟢 *\"{say}\"*")
                        
                    st.write("**Phrases to avoid:**")
                    for avoid in report.get("phrases_to_avoid", []):
                        st.write(f"- 🔴 ~~*\"{avoid}\"*~~")
                        
                    st.write("**Non-Salary Benefits Worth Negotiating:**")
                    st.write(", ".join(report.get("non_salary_benefits_to_negotiate", [])))
                    
                with col_email:
                    st.markdown("##### ✉️ Professional Counter-Offer Email")
                    st.text_area("Copy and customize this template", value=report.get("email_template"), height=350)
                    
        except Exception as e:
            st.error(f"Error calculating salary strategy: {str(e)}")
            logger.error(f"Streamlit salary guidance error: {str(e)}")
