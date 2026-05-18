import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function SkillGap() {
  const [skills, setSkills] = useState(['Python', 'SQL', 'Excel']);
  const [input, setInput] = useState('');
  
  const mockData = [
    { subject: 'Python', A: 80, B: 90, fullMark: 100 },
    { subject: 'SQL', A: 90, B: 85, fullMark: 100 },
    { subject: 'ML', A: 30, B: 70, fullMark: 100 },
    { subject: 'Cloud', A: 20, B: 60, fullMark: 100 },
    { subject: 'Comm', A: 70, B: 80, fullMark: 100 },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      setSkills([...skills, input.trim()]);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-['Plus_Jakarta_Sans']">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🗺️ Skill Gap Mapper</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="font-bold mb-4 text-lg">Your Profile</h2>
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Current Skills (Press Enter to add)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full text-sm border border-indigo-500/30">
                    {s} <span className="ml-1 cursor-pointer font-bold" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}>×</span>
                  </span>
                ))}
              </div>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 focus:border-indigo-500 focus:outline-none" placeholder="Add a skill..." />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Target Role</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 focus:border-indigo-500 focus:outline-none" defaultValue="Data Scientist" />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors py-3 rounded-lg font-bold mt-4 shadow-[0_4px_24px_rgba(79,70,229,0.3)]">Analyze Gaps</button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-96 flex flex-col shadow-xl">
              <h2 className="font-bold mb-4 text-lg">Competency Radar</h2>
              <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Current" dataKey="A" stroke="#EF4444" fill="#EF4444" fillOpacity={0.4} />
                    <Radar name="Target" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-5 rounded-xl border border-red-500/50 shadow-lg">
                <h3 className="text-red-400 font-bold mb-2">⚠️ Critical Gap: Docker</h3>
                <p className="text-sm text-slate-400 mb-2">Required for containerized deployments in ML.</p>
                <div className="flex gap-2">
                  <a href="#" className="text-xs bg-slate-700 hover:bg-slate-600 transition-colors px-2 py-1 rounded">YouTube</a>
                  <a href="#" className="text-xs bg-slate-700 hover:bg-slate-600 transition-colors px-2 py-1 rounded">Udemy</a>
                </div>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl border border-amber-500/50 shadow-lg">
                <h3 className="text-amber-400 font-bold mb-2">💡 Nice to Have: Kubernetes</h3>
                <p className="text-sm text-slate-400 mb-2">Good for senior roles in MLOps.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
