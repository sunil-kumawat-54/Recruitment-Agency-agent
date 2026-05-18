import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ResumeAnalyzer } from '../../components/agents/ResumeAnalyzer';
import { InterviewAgent } from '../../components/agents/InterviewAgent';
import { SkillGapAgent } from '../../components/agents/SkillGapAgent';
import { JobMatchingAgent } from '../../components/agents/JobMatchingAgent';
import { SalaryAgent } from '../../components/agents/SalaryAgent';
import { useAgentStore } from '../../store/agentStore';

export const SeekerDashboard: React.FC = () => {
  const { activeModule } = useAgentStore();
  const [userMode, setUserMode] = useState<'seeker' | 'recruiter'>('seeker');

  const renderActiveAgent = () => {
    switch (activeModule) {
      case 'resume':
        return <ResumeAnalyzer />;
      case 'interview':
        return <InterviewAgent />;
      case 'skills':
        return <SkillGapAgent />;
      case 'jobs':
        return <JobMatchingAgent />;
      case 'salary':
        return <SalaryAgent />;
      default:
        return <ResumeAnalyzer />;
    }
  };

  return (
    <div className="flex bg-brand-dark min-h-screen text-slate-200">
      {/* Navigation Sidebar */}
      <Sidebar userMode="seeker" setUserMode={() => {}} />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />
        
        <main className="flex-1 px-8 py-10 bg-gradient-to-tr from-brand-dark via-brand-dark to-slate-950/60 relative">
          {/* Decorative glows */}
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
          
          <div className="max-w-5xl mx-auto space-y-8">
            {renderActiveAgent()}
          </div>
          
          <Footer />
        </main>
      </div>
    </div>
  );
};
export default SeekerDashboard;
