import streamlit as st
from backend.agents.salary_agent import SalaryNegotiationAgent

# Try mapping the local Chroma retriever
try:
    from backend.rag.retriever import retriever
except ImportError:
    retriever = None

st.set_page_config(page_title="Salary Guide", page_icon="💰", layout="wide")

st.title("💰 Salary & Negotiation Guide")
st.markdown("Evaluate your offers and generate professional counter-offer email drafts.")

# --- SIDEBAR: PARAMETERS ---
with st.sidebar:
    st.header("Offer Parameters")
    role = st.text_input("Job Role", "Software Engineer")
    experience = st.number_input("Years of Experience", 0, 30, 3)
    location = st.text_input("Location", "Bangalore")
    skills = st.text_area("Core Skills", "Python, AWS, System Design")
    current_ctc = st.text_input("Current CTC (Optional)", "12 LPA")
    received_offer = st.text_input("Received Offer (Optional)", "16 LPA")

# --- EXECUTION BUTTON ---
if st.button("Generate Negotiation Strategy", type="primary"):
    with st.spinner("Analyzing market trends and crafting counter-offer blueprint..."):
        try:
            agent = SalaryNegotiationAgent(retriever=retriever)
            report = agent.get_salary_range(role, experience, location, [skills], current_ctc, received_offer)
            
            st.success("Negotiation Benchmarks Compiled!")
            
            # Top Metrics
            c1, c2, c3 = st.columns(3)
            curr_type = report.get('market_salary_range', {}).get('currency', '')
            
            with c1:
                st.metric("Verdict", report.get("negotiation_verdict", "Unknown"))
            with c2:
                val = report.get('your_market_value', 0)
                st.metric("Your Market Value", f"{val:,} {curr_type}" if isinstance(val, int) else f"{val} {curr_type}")
            with c3:
                ask = report.get('recommended_ask', 0)
                st.metric("Recommended Ask", f"{ask:,} {curr_type}" if isinstance(ask, int) else f"{ask} {curr_type}")
                
            st.divider()
            
            r_col1, r_col2 = st.columns(2)
            with r_col1:
                st.subheader("Industry Benchmarks")
                range_data = report.get("market_salary_range", {})
                
                try:
                    st.write(f"**Minimum:** {range_data.get('minimum', 0):,} {curr_type}")
                    st.write(f"**Median:** {range_data.get('median', 0):,} {curr_type}")
                    st.write(f"**Maximum:** {range_data.get('maximum', 0):,} {curr_type}")
                except ValueError:
                    st.write(f"**Minimum:** {range_data.get('minimum', 0)} {curr_type}")
                    st.write(f"**Median:** {range_data.get('median', 0)} {curr_type}")
                    st.write(f"**Maximum:** {range_data.get('maximum', 0)} {curr_type}")

                st.write(f"**Trend:** {report.get('market_trend', '')}")
                
            with r_col2:
                st.subheader("Negotiation Blueprint")
                strat = report.get("negotiation_strategy", {})
                st.write(f"**Approach:** {strat.get('strategy_name', '')}")
                try:
                    st.write(f"**Opening Anchor:** {strat.get('opening_number', 0):,} {curr_type}")
                    st.write(f"**Ideal Outcome:** {strat.get('ideal_outcome', 0):,} {curr_type}")
                    st.write(f"**Walkaway Minimum:** {strat.get('minimum_acceptable', 0):,} {curr_type}")
                except ValueError:
                    st.write(f"**Opening Anchor:** {strat.get('opening_number', 0)} {curr_type}")
                    st.write(f"**Ideal Outcome:** {strat.get('ideal_outcome', 0)} {curr_type}")
                    st.write(f"**Walkaway Minimum:** {strat.get('minimum_acceptable', 0)} {curr_type}")
                
            st.divider()
            
            p_col1, p_col2 = st.columns(2)
            with p_col1:
                st.subheader("Verbal Playbook")
                st.markdown("**✅ Phrases to Use:**")
                for p in report.get("phrases_to_use", []):
                    st.success(f'"{p}"')
                st.markdown("**❌ Phrases to Avoid:**")
                for p in report.get("phrases_to_avoid", []):
                    st.error(f'"{p}"')
            
            with p_col2:
                st.subheader("Counter-Offer Email Draft")
                st.text_area("Copy and customize this email:", report.get("email_template", ""), height=300)
                
                st.markdown("**Alternative Benefits to Target:**")
                st.write(", ".join(report.get("non_salary_benefits_to_negotiate", [])))
                
        except Exception as e:
            st.error(f"Failed to compile report: {e}")
