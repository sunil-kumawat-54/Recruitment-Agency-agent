import React from 'react';
import { motion } from 'framer-motion';

const agents = [
  { name: 'Resume Analyzer', desc: 'ATS scoring & keyword optimization', icon: '📄' },
  { name: 'Mock Interviewer', desc: 'Real-time AI Q&A feedback', icon: '🎤' },
  { name: 'Skill Gap Mapper', desc: 'Personalized learning roadmaps', icon: '🗺️' },
  { name: 'Job Matcher', desc: 'Semantic market fit scoring', icon: '🎯' },
  { name: 'Salary Negotiator', desc: 'Compensation benchmarks & strategies', icon: '💰' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-['Plus_Jakarta_Sans']">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-20 px-6 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
          Your AI-Powered Career Co-Pilot
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Automate your recruitment journey. Get ATS-optimized resumes, crack interviews with AI, and land the perfect role.
        </p>
        <div className="flex justify-center gap-6">
          <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-semibold transition-all shadow-[0_4px_24px_rgba(79,70,229,0.3)]">
            Get Started as Job Seeker
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-3 rounded-lg font-semibold transition-all">
            I'm a Recruiter
          </button>
        </div>
      </motion.section>

      {/* Agents Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-6 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Meet Your AI Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer group shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{agent.icon}</div>
              <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
              <p className="text-slate-400">{agent.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* How it Works */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-6 bg-slate-800/30"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            {[
              { step: 1, title: 'Upload Profile', desc: 'Share your resume or skills.' },
              { step: 2, title: 'AI Analysis', desc: 'Our agents analyze gaps & matches.' },
              { step: 3, title: 'Actionable Insights', desc: 'Get interview ready & hired.' }
            ].map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-[0_4px_24px_rgba(79,70,229,0.3)]">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <div className="bg-indigo-600 text-white py-8 px-6 text-center font-semibold text-lg md:text-xl shadow-[0_4px_24px_rgba(79,70,229,0.3)]">
        5 AI Agents | 1000+ Interview Questions | 500+ Job Descriptions
      </div>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-slate-800 mt-20 text-slate-500">
        <p>&copy; 2026 HireIQ — AI Recruitment Agency. All rights reserved.</p>
      </footer>
    </div>
  );
}
