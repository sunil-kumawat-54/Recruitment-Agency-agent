import streamlit as st
import time
from backend.agents.interview_agent import InterviewAgent

# Load retriever if available
try:
    from backend.rag.retriever import retriever
except ImportError:
    retriever = None

st.set_page_config(page_title="Mock Interview", page_icon="🎤", layout="wide")

st.title("🎤 AI Mock Interview")
st.markdown("Practice your interview skills with an elite AI interviewer in real-time.")

# Session State Initialization
if "interview_started" not in st.session_state:
    st.session_state.interview_started = False
if "questions" not in st.session_state:
    st.session_state.questions = []
if "current_q_idx" not in st.session_state:
    st.session_state.current_q_idx = 0
if "qa_history" not in st.session_state:
    st.session_state.qa_history = []
if "session_summary" not in st.session_state:
    st.session_state.session_summary = None
if "current_score" not in st.session_state:
    st.session_state.current_score = 0.0
if "opening_message" not in st.session_state:
    st.session_state.opening_message = ""

# --- SIDEBAR CONFIGURATION ---
with st.sidebar:
    st.header("⚙️ Interview Settings")
    role = st.text_input("Target Role", value="Software Engineer")
    level = st.selectbox("Experience Level", ["Junior", "Mid", "Senior", "Lead", "Staff"])
    round_type = st.selectbox("Interview Round Type", [
        "Technical Round", 
        "HR Round", 
        "Managerial Round", 
        "Case Study Round"
    ])
    
    st.divider()

    if not st.session_state.interview_started and not st.session_state.session_summary:
        if st.button("🚀 Start Interview", type="primary", use_container_width=True):
            with st.spinner("Compiling customized question banks..."):
                agent = InterviewAgent(retriever=retriever)
                data = agent.generate_questions(role, level, round_type)
                st.session_state.questions = data.get("questions", [])
                st.session_state.opening_message = data.get("opening_message", "Welcome! Let's begin the interview.")
                st.session_state.interview_started = True
                st.session_state.current_q_idx = 0
                st.session_state.qa_history = []
                st.session_state.session_summary = None
                st.session_state.current_score = 0.0
                st.rerun()

    if st.session_state.interview_started:
        st.metric("Live Score Average", f"{st.session_state.current_score}/10")
        total_q = len(st.session_state.questions)
        curr_q = st.session_state.current_q_idx
        st.progress(curr_q / max(1, total_q), text=f"Progress: Question {curr_q} of {total_q}")
        
        if st.button("⏹️ End Session Early", type="secondary", use_container_width=True):
            st.session_state.interview_started = False
            st.rerun()
            
    if st.session_state.session_summary:
        if st.button("🔄 Start New Interview", use_container_width=True):
            st.session_state.session_summary = None
            st.session_state.interview_started = False
            st.rerun()

# --- MAIN INTERVIEW VIEW ---
if st.session_state.session_summary:
    # Render Final Report
    st.success("Session Completed Successfully!")
    summary = st.session_state.session_summary
    
    st.header("📊 Final Evaluation Report")
    
    col1, col2 = st.columns([1, 2])
    with col1:
        st.metric("Overall Score", f"{summary.get('overall_score', 0)}/100")
        st.metric("Hire Recommendation", summary.get("hire_recommendation", "N/A"))
        
        st.subheader("Performance Split")
        for p_type, val in summary.get("performance_by_type", {}).items():
            st.progress(val / 100.0, text=f"{p_type.title()}: {val}/100")

    with col2:
        st.info(f"**Closing Remarks:** {summary.get('encouragement_message', '')}")
        
        st.subheader("🌟 Top Strengths")
        for s in summary.get("top_strengths", []):
            st.write(f"- {s}")
            
        st.subheader("⚠️ Areas for Improvement")
        for a in summary.get("areas_for_improvement", []):
            st.write(f"- {a}")
            
        st.subheader("📚 Personalized Study Plan")
        for p in summary.get("personalized_study_plan", []):
            st.write(f"• {p}")

elif st.session_state.interview_started:
    # Display Chat History
    with st.chat_message("assistant", avatar="🤖"):
        st.write(st.session_state.opening_message)
        
    for qa in st.session_state.qa_history:
        with st.chat_message("assistant", avatar="🤖"):
            st.write(f"**Q:** {qa['question']}")
        with st.chat_message("user"):
            st.write(qa["candidate_answer"])
            
        eval_data = qa["evaluation"]
        with st.chat_message("assistant", avatar="💡"):
            color = "green" if eval_data["score"] >= 7 else "orange" if eval_data["score"] >= 5 else "red"
            st.markdown(f"**Evaluation [{eval_data['verdict']}] - Score:** :{color}[**{eval_data['score']}/10**]")
            st.info(eval_data["feedback"])
            
            with st.expander("Detailed Breakdown"):
                st.write(f"**Strong Points:** {eval_data.get('what_was_strong', '')}")
                st.write(f"**Missing Points:** {eval_data.get('what_was_missing', '')}")
                st.write(f"**Model Outline:** {eval_data.get('model_answer_outline', '')}")

    # Display Current Question & Handle Input
    if st.session_state.current_q_idx < len(st.session_state.questions):
        curr_question = st.session_state.questions[st.session_state.current_q_idx]
        
        with st.chat_message("assistant", avatar="🤖"):
            st.write(f"**Question {st.session_state.current_q_idx + 1}:** {curr_question['question']}")
            with st.expander("Show Hint (Practice Mode)"):
                st.write(curr_question.get("hint", "No hint available."))
                
        user_answer = st.chat_input("Type your response here...")
        
        if user_answer:
            with st.chat_message("user"):
                st.write(user_answer)
                
            with st.spinner("Evaluating your response..."):
                agent = InterviewAgent(retriever=retriever)
                evaluation = agent.evaluate_answer(curr_question["question"], user_answer, role, level)
                
                # Append to history
                st.session_state.qa_history.append({
                    "question": curr_question["question"],
                    "candidate_answer": user_answer,
                    "evaluation": evaluation
                })
                
                # Update Score
                scores = [qa["evaluation"].get("score", 0) for qa in st.session_state.qa_history]
                st.session_state.current_score = round(sum(scores) / len(scores), 1)
                
                # Advance Question
                st.session_state.current_q_idx += 1
                st.rerun()
    else:
        # All questions finished
        st.success("All questions completed!")
        if st.button("Generate Final Assessment Report", type="primary"):
            with st.spinner("Compiling your comprehensive interview feedback..."):
                agent = InterviewAgent(retriever=retriever)
                history_for_agent = []
                for qa in st.session_state.qa_history:
                    history_for_agent.append({
                        "question": qa["question"],
                        "answer": qa["candidate_answer"],
                        "score": qa["evaluation"].get("score", 0)
                    })
                    
                summary = agent.summarize_session(history_for_agent, role)
                st.session_state.session_summary = summary
                st.session_state.interview_started = False
                st.rerun()
else:
    # Idle State
    st.info("👈 Please configure your target role and click **Start Interview** in the sidebar to begin.")
