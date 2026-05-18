import { create } from 'zustand';

interface UserState {
  userMode: 'seeker' | 'recruiter';
  setUserMode: (mode: 'seeker' | 'recruiter') => void;
  candidateName: string;
  setCandidateName: (name: string) => void;
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userMode: 'seeker',
  setUserMode: (mode) => set({ userMode: mode }),
  candidateName: 'Rahul Sharma',
  setCandidateName: (name) => set({ candidateName: name }),
  sessionToken: null,
  setSessionToken: (token) => set({ sessionToken: token }),
}));
