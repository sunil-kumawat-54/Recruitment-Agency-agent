import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
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
  const response = await api.post('/api/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const startInterview = async (role: string, level: string) => {
  const response = await api.post('/api/interview/start', { role, level });
  return response.data;
};

export const submitAnswer = async (sessionId: string, questionId: number, answer: string) => {
  const response = await api.post(`/api/interview/${sessionId}/answer`, { questionId, answer });
  return response.data;
};

export const analyzeSkillGap = async (skills: string[], targetRole: string) => {
  const response = await api.post('/api/skills/analyze', { skills, targetRole });
  return response.data;
};

export const matchJobs = async (profile: any) => {
  const response = await api.post('/api/jobs/match', profile);
  return response.data;
};

export const getSalaryGuide = async (role: string, experience: number, location: string) => {
  const response = await api.post('/api/salary/guide', { role, experience, location });
  return response.data;
};

export const getATSScore = async (resumeText: string, jobDescription: string) => {
  const response = await api.post('/api/resume/ats-score', { resumeText, jobDescription });
  return response.data;
};

export default api;
