import React from 'react';
import { useAgentStore, ActiveModule } from '../../store/agentStore';
import { FileText, MessageSquare, Compass, Award, DollarSign, Brain, Users } from 'lucide-react';

interface SidebarProps {
  userMode: 'seeker' | 'recruiter';
  setUserMode: (mode: 'seeker' | 'recruiter') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userMode, setUserMode }) => {
  const { activeModule, setActiveModule, interviewActive } = useAgentStore();

  const navigationItems: Array<{
    id: ActiveModule;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'resume',
      label: 'Resume Analyzer',
      description: 'ATS scoring & keyword matching',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'interview',
      label: 'Mock Interview',
      description: 'Dynamic Q&A & live grading',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'skills',
      label: 'Skill Gap & Roadmap',
      description: 'Competency checks & roadmap plans',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'jobs',
      label: 'Job Matcher',
      description: 'Semantic position sorting',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'salary',
      label: 'Salary Guide',
      description: 'Negotiation counter emails',
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-80 h-screen bg-brand-dark/95 border-r border-brand-border flex flex-col justify-between p-6 z-20 shrink-0">
      <div className="flex flex-col space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-brand-purple to-brand-emerald rounded-xl animate-pulse">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              HireIQ
            </h1>
            <span className="text-[9px] text-brand-emerald font-semibold uppercase tracking-wider block">
              AI Recruitment Agency
            </span>
          </div>
        </div>

        {/* Dual Switcher */}
        <div className="bg-slate-900/80 p-1 rounded-xl border border-brand-border flex gap-1">
          <button
            onClick={() => !interviewActive && setUserMode('seeker')}
            disabled={interviewActive}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              userMode === 'seeker'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-brand-gray hover:text-slate-200 disabled:opacity-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Job Seeker
          </button>
          <button
            onClick={() => !interviewActive && setUserMode('recruiter')}
            disabled={interviewActive}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              userMode === 'recruiter'
                ? 'bg-brand-emerald text-brand-dark shadow-md'
                : 'text-brand-gray hover:text-slate-200 disabled:opacity-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Recruiter
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col space-y-1">
          <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest pl-2 mb-1">
            Specialized Agents
          </span>
          
          {userMode === 'seeker' ? (
            navigationItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all duration-200 group ${
                    isActive
                      ? 'bg-brand-purple/10 border border-brand-purple/20 text-white shadow-premium'
                      : 'border border-transparent text-brand-gray hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-brand-purple text-white' : 'bg-slate-900 group-hover:bg-slate-800 text-brand-gray group-hover:text-slate-100'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs leading-none mb-1 text-slate-200 group-hover:text-white">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight truncate">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-4 bg-slate-900/40 rounded-xl border border-brand-border text-center">
              <p className="text-xs text-brand-gray leading-relaxed mb-3">
                You are in **Recruiter Mode**. Access advanced pipeline matching and Bulk resume ATS scoring in the main dashboard.
              </p>
              <div className="p-2 bg-brand-emerald/10 border border-brand-emerald/20 rounded-lg text-[9px] text-brand-emerald font-bold uppercase">
                Recruiter Active
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="flex flex-col space-y-3 bg-slate-900/20 p-4 rounded-xl border border-brand-border/40 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">LLM Engine</span>
          <span className="text-brand-emerald font-semibold flex items-center gap-1">
            <span className="w-1 h-1 bg-brand-emerald rounded-full animate-ping" />
            Gemini
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Vectorstore</span>
          <span className="text-slate-300 font-medium">ChromaDB</span>
        </div>
      </div>
    </div>
  );
};
