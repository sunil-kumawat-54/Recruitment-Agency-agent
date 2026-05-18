import React from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { SalaryAgent } from '../../components/agents/SalaryAgent';

export const SalaryGuide: React.FC = () => {
  return (
    <div className="flex bg-brand-dark min-h-screen text-slate-200">
      <Sidebar userMode="seeker" setUserMode={() => {}} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navbar />
        <main className="flex-1 px-8 py-10 bg-gradient-to-tr from-brand-dark via-brand-dark to-slate-950/60 relative">
          <div className="max-w-5xl mx-auto">
            <SalaryAgent />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
export default SalaryGuide;
