import { create } from 'zustand';

interface AgentState {
  userType: 'seeker' | 'recruiter' | null;
  currentAgent: string | null;
  resumeAnalysis: any | null;
  interviewSession: any | null;
  skillGapResult: any | null;
  jobMatches: any[];
  salaryData: any | null;
  isLoading: boolean;
  error: string | null;
  setUserType: (type: 'seeker' | 'recruiter' | null) => void;
  setCurrentAgent: (agent: string | null) => void;
  setAnalysisResult: (key: string, data: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  userType: null,
  currentAgent: null,
  resumeAnalysis: null,
  interviewSession: null,
  skillGapResult: null,
  jobMatches: [],
  salaryData: null,
  isLoading: false,
  error: null,
  setUserType: (type) => set({ userType: type }),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setAnalysisResult: (key, data) => set((state) => ({ ...state, [key]: data })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetStore: () => set({
    userType: null,
    currentAgent: null,
    resumeAnalysis: null,
    interviewSession: null,
    skillGapResult: null,
    jobMatches: [],
    salaryData: null,
    isLoading: false,
    error: null,
  }),
}));
