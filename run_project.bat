@echo off
echo ===================================================
echo     HireIQ — AI Recruitment Agency Platform Loader
echo ===================================================
echo.
echo 1. Starting FastAPI Rest API Server (Port 8000)...
start cmd /k "set PYTHONPATH=%cd%&& cd backend && uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload"
echo 2. Starting Streamlit Admin Workspace (Port 8501)...
start cmd /k "set PYTHONPATH=%cd%&& cd backend && streamlit run app.py --server.port 8501"
echo 3. Starting React + Vite Premium Frontend (Port 5173)...
start cmd /k "cd frontend && npm run dev"
echo.
echo ===================================================
echo All services triggered successfully!
echo - React Frontend  : http://localhost:5173
echo - FastAPI Backend : http://localhost:8000/docs
echo - Streamlit Admin : http://localhost:8501
echo ===================================================
