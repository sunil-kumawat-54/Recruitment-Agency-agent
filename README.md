# 🤖 HireIQ — AI Recruitment Agency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Google Gemini API key (free at https://aistudio.google.com)

### Setup

1. **Clone and setup environment**:
   ```bash
   git clone <repo> && cd hireiq
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env
   ```

2. **Start Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   bash run.sh
   # FastAPI → http://localhost:8000
   # Streamlit → http://localhost:8501
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   # React App → http://localhost:5173
   ```

4. **Initialize Database**:
   - Open `http://localhost:8501`
   - Click "Initialize Database" in the sidebar
   - Wait 30 seconds for ChromaDB seeding

## 🤖 Agents Overview
| Agent | Function | Input | Output |
|-------|----------|-------|--------|
| **Resume Analyzer** | ATS scoring + feedback | PDF/DOCX | Score report |
| **Interview Agent** | Mock interviews | Role + Level | Q&A + feedback |
| **Skill Gap Agent** | Gap analysis + roadmap | Skills + Target role | Learning plan |
| **Job Matching** | Semantic job matching | Profile | Top job matches |
| **Salary Agent** | Compensation analysis | Role + Experience | Salary guide |

## 📁 Folder Structure
```text
hireiq/
├── frontend/                          # React + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── agents/
│   │   │   │   ├── ResumeAnalyzer.tsx
│   │   │   │   ├── InterviewAgent.tsx
│   │   │   │   ├── SkillGapAgent.tsx
│   │   │   │   ├── JobMatchingAgent.tsx
│   │   │   │   └── SalaryAgent.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── shared/
│   │   │       ├── ChatWindow.tsx
│   │   │       ├── FileUpload.tsx
│   │   │       ├── ATSScoreGauge.tsx
│   │   │       ├── SkillRadarChart.tsx
│   │   │       └── JobCard.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── seeker/
│   │   │   │   ├── SeekerDashboard.tsx
│   │   │   │   ├── ResumeAnalysis.tsx
│   │   │   │   ├── MockInterview.tsx
│   │   │   │   ├── SkillGap.tsx
│   │   │   │   └── SalaryGuide.tsx
│   │   │   └── recruiter/
│   │   │       ├── RecruiterDashboard.tsx
│   │   │       └── BulkATS.tsx
│   │   ├── services/
│   │   │   └── api.ts                 # Axios setup to FastAPI
│   │   ├── store/
│   │   │   └── agentStore.ts          # Zustand state management
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                  # Tailwind imports
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts                 # Proxy to localhost:8000
│
├── backend/                           # Python + Streamlit + FastAPI
│   ├── agents/                        # AI Logic (Gemini API)
│   │   ├── base_agent.py
│   │   ├── resume_analyzer.py
│   │   ├── interview_agent.py
│   │   ├── skill_gap_agent.py
│   │   ├── job_matching_agent.py
│   │   └── salary_agent.py
│   ├── api/                           # FastAPI Endpoints for React
│   │   ├── main.py
│   │   └── routes/
│   │       ├── resume.py
│   │       ├── interview.py
│   │       ├── skills.py
│   │       ├── jobs.py
│   │       └── salary.py
│   ├── rag/                           # ChromaDB Vector Store
│   │   ├── vectorstore.py
│   │   ├── embeddings.py
│   │   ├── ingestion.py               # Document loaders
│   │   └── retriever.py
│   ├── utils/
│   │   └── pdf_parser.py
│   │   └── ats_scorer.py
│   ├── pages/                         # Streamlit sub-pages
│   │   ├── 1_Resume_Analyzer.py
│   │   ├── 2_Mock_Interview.py
│   │   ├── 3_Skill_Gap.py
│   │   ├── 4_Job_Matching.py
│   │   ├── 5_Salary_Negotiation.py
│   │   └── 7_RAG_Admin.py             # Re-seed DB, test queries
│   ├── app.py                         # Streamlit Main App
│   ├── config.py                      # Env variables loading
│   ├── requirements.txt
│   ├── .env.example
│   └── run.sh                         # Starts FastAPI and Streamlit
```

## 🔑 Environment Variables
`GEMINI_API_KEY`=your_key_here
`CHROMA_DB_PATH`=./chroma_db

## 🛠️ Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS + Zustand
- **Backend**: Python + Streamlit + FastAPI
- **AI**: Google Gemini 1.5 Flash
- **Vector DB**: ChromaDB (local)
- **Embeddings**: Google Embedding-001
