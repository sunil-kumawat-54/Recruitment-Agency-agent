import { create } from 'zustand';

export type ActiveModule = 'resume' | 'interview' | 'skills' | 'jobs' | 'salary';

interface InterviewAnswer {
  question: string;
  answer: string;
  score: number;
  type: string;
}

interface InterviewParams {
  role: string;
  level: string;
  roundType: string;
}

interface AgentState {
  // Navigation
  userType: 'seeker' | 'recruiter' | null;
  activeModule: ActiveModule;
  currentAgent: string | null;

  // Resume
  resumeAnalysis: any | null;
  resumeReport: any | null;

  // Interview
  interviewSession: any | null;
  interviewActive: boolean;
  interviewQuestions: any[] | null;
  currentQuestionIndex: number;
  interviewAnswers: any[];
  interviewHistory: InterviewAnswer[];
  interviewFeedback: any | null;
  interviewSummary: any | null;
  interviewParams: InterviewParams;
  candidateName: string;

  // Skills
  skillGapResult: any | null;
  skillGapReport: any | null;

  // Jobs
  jobMatches: any[];
  jobMatchReport: any | null;

  // Salary
  salaryData: any | null;
  salaryReport: any | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Setters
  setUserType: (type: 'seeker' | 'recruiter' | null) => void;
  setActiveModule: (module: ActiveModule) => void;
  setCurrentAgent: (agent: string | null) => void;
  setAnalysisResult: (key: string, data: any) => void;
  setLoading: (loading: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResumeReport: (data: any) => void;
  setSkillGapReport: (data: any) => void;
  setJobMatchReport: (data: any) => void;
  setSalaryReport: (data: any) => void;
  setInterviewActive: (active: boolean) => void;
  setInterviewQuestions: (questions: any[] | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setInterviewAnswers: (answers: any[]) => void;
  setInterviewFeedback: (feedback: any) => void;
  setInterviewSummary: (summary: any) => void;
  setInterviewParams: (params: InterviewParams) => void;
  addInterviewAnswer: (answer: InterviewAnswer) => void;
  clearInterviewHistory: () => void;
  setCandidateName: (name: string) => void;
  resetStore: () => void;
}

const initialState = {
  userType: null as 'seeker' | 'recruiter' | null,
  activeModule: 'resume' as ActiveModule,
  currentAgent: null as string | null,
  resumeAnalysis: null,
  resumeReport: null,
  interviewSession: null,
  interviewActive: false,
  interviewQuestions: null as any[] | null,
  currentQuestionIndex: 0,
  interviewAnswers: [] as any[],
  interviewHistory: [] as InterviewAnswer[],
  interviewFeedback: null,
  interviewSummary: null,
  interviewParams: { role: 'Software Engineer', level: 'Mid', roundType: 'Technical' } as InterviewParams,
  candidateName: 'Candidate',
  skillGapResult: null,
  skillGapReport: null,
  jobMatches: [] as any[],
  jobMatchReport: null,
  salaryData: null,
  salaryReport: null,
  isLoading: false,
  error: null as string | null,
};

export const useAgentStore = create<AgentState>((set) => ({
  ...initialState,
  setUserType: (type) => set({ userType: type }),
  setActiveModule: (module) => set({ activeModule: module }),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setAnalysisResult: (key, data) => set((state) => ({ ...state, [key]: data })),
  setLoading: (loading) => set({ isLoading: loading }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setResumeReport: (data) => set({ resumeReport: data }),
  setSkillGapReport: (data) => set({ skillGapReport: data }),
  setJobMatchReport: (data) => set({ jobMatchReport: data }),
  setSalaryReport: (data) => set({ salaryReport: data }),
  setInterviewActive: (active) => set({ interviewActive: active }),
  setInterviewQuestions: (questions) => set({ interviewQuestions: questions }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setInterviewAnswers: (answers) => set({ interviewAnswers: answers }),
  setInterviewFeedback: (feedback) => set({ interviewFeedback: feedback }),
  setInterviewSummary: (summary) => set({ interviewSummary: summary }),
  setInterviewParams: (params) => set({ interviewParams: params }),
  addInterviewAnswer: (answer) => set((state) => ({ interviewHistory: [...state.interviewHistory, answer] })),
  clearInterviewHistory: () => set({ interviewHistory: [], interviewAnswers: [] }),
  setCandidateName: (name) => set({ candidateName: name }),
  resetStore: () => set(initialState),
}));
