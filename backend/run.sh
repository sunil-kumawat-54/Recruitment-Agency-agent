#!/bin/bash
echo "Starting HireIQ Backend..."
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload &
streamlit run app.py --server.port 8501
