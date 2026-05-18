import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BulkATS } from './BulkATS';
import { AIDiscussion } from './AIDiscussion';
import { CandidateScreen } from './CandidateScreen';
import { Layers, MessageSquare, Briefcase } from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bulk' | 'chat' | 'screen'>('bulk');
  const [screenedCandidates, setScreenedCandidates] = useState<any[]>([]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'bulk':
        return <BulkATS screenedCandidates={screenedCandidates} setScreenedCandidates={setScreenedCandidates} />;
      case 'chat':
        return <AIDiscussion screenedCandidates={screenedCandidates} />;
      case 'screen':
        return <CandidateScreen screenedCandidates={screenedCandidates} />;
      default:
        return <BulkATS screenedCandidates={screenedCandidates} setScreenedCandidates={setScreenedCandidates} />;
    }
  };

  return (
    <div className="flex bg-brand-dark min-h-screen text-slate-200">
      <Sidebar userMode="recruiter" setUserMode={() => {}} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />

        <main className="flex-1 px-8 py-10 bg-gradient-to-tr from-brand-dark via-brand-dark to-slate-950/60 relative">
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-brand-emerald/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Title */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                  💼 Recruiter Workspace Dashboard
                </h2>
                <p className="text-brand-gray text-xs leading-relaxed max-w-2xl">
                  Evaluate talent pools, verify match leaderboards against target criteria, and debate candidate strengths with Gemini.
                </p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="border-b border-brand-border flex gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('bulk')}
                className={`pb-4 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'bulk' ? 'border-brand-emerald text-brand-emerald' : 'border-transparent text-brand-gray hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Bulk ATS Screening
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`pb-4 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'chat' ? 'border-brand-emerald text-brand-emerald' : 'border-transparent text-brand-gray hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                AI Advisory Chat
              </button>
              <button
                onClick={() => setActiveTab('screen')}
                className={`pb-4 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'screen' ? 'border-brand-emerald text-brand-emerald' : 'border-transparent text-brand-gray hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Candidate Screen Reports
              </button>
            </div>

            {renderActiveScreen()}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};
export default RecruiterDashboard;
