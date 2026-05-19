import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const analyzeResume = async (file: File, targetRole: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_role', targetRole);
  const response = await client.post('/api/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const startInterview = async (role: string, level: string, roundType: string) => {
  const response = await client.post('/api/interview/start', { role, level, roundType });
  return response.data;
};

export const evaluateInterview = async (question: string, answer: string, role: string, level: string) => {
  const response = await client.post(`/api/interview/evaluate`, { question, answer, role, level });
  return response.data;
};

export const completeInterview = async (history: any[], role: string) => {
  const response = await client.post(`/api/interview/complete`, { history, role });
  return response.data;
};

export const analyzeSkillGap = async (params: any) => {
  const response = await client.post('/api/skills/analyze', params);
  return response.data;
};

export const matchJobs = async (profile: any) => {
  const response = await client.post('/api/jobs/match', profile);
  return response.data;
};

export const getSalaryGuide = async (params: any) => {
  const response = await client.post('/api/salary/guide', params);
  return response.data;
};

export const getATSScore = async (resumeText: string, jobDescription: string) => {
  const response = await client.post('/api/resume/ats-score', { resumeText, jobDescription });
  return response.data;
};

export const api = {
  resume: {
    analyze: analyzeResume,
    atsScore: getATSScore,
  },
  interview: {
    start: startInterview,
    evaluate: evaluateInterview,
    complete: completeInterview,
  },
  skills: {
    gap: analyzeSkillGap,
  },
  jobs: {
    match: matchJobs,
  },
  salary: {
    guide: getSalaryGuide,
  }
};

export default api;
