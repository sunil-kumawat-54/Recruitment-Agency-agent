import React, { useState } from 'react';
import { useAgentStore } from '../../store/agentStore';
import { api } from '../../services/api';
import { JobCard } from '../shared/JobCard';
import { Award, Check, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const JobMatchingAgent: React.FC = () => {
  const { jobMatchReport, setJobMatchReport, isLoading, setIsLoading } = useAgentStore();
  const [skills, setSkills] = useState('Python, SQL, REST APIs, Git, Docker, Postgres');
  const [experience, setExperience] = useState(3);
  const [currentRole, setCurrentRole] = useState('Software Engineer');
  const [education, setEducation] = useState('B.Tech Computer Science');
  const [location, setLocation] = useState('Bangalore');
  const [expectedSalary, setExpectedSalary] = useState('18 LPA');

  const handleMatch = async () => {
    setIsLoading(true);
    try {
      const data = await api.jobs.match({
        skills,
        years_experience: experience,
        current_role: currentRole,
        education,
        location,
        expected_salary: expectedSalary,
      });
      setJobMatchReport(data);
      toast.success('Semantic matching complete!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to locate job matches.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          🎯 Job Matching Agent
        </h2>
        <p className="text-brand-gray text-xs leading-relaxed max-w-2xl">
          Conduct semantic similarity checks against our active seed vacancy records. Discover compatibility grades and strategic application guidelines.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-brand-border/60 pb-3">
          Complete Your Career Credentials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Current Position Title
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Education Credentials
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Location (City / Country)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Target Compensation / Expected CTC
              </label>
              <input
                type="text"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Technical Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleMatch}
          disabled={isLoading || !skills.trim()}
          className="w-full bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple/90 hover:to-indigo-600/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Scan Compatible Openings'
          )}
        </button>
      </div>

      {/* Matching Feed */}
      {jobMatchReport && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-brand-border text-xs">
            <span>
              Total matches discovered:{' '}
              <strong className="text-brand-purple">{jobMatchReport.total_matches || 0}</strong>
            </span>
            <span>
              Overall Market Demand Fit:{' '}
              <strong className="text-brand-emerald">{jobMatchReport.market_demand || 'High'}</strong>
            </span>
          </div>

          <div className="space-y-6">
            {jobMatchReport.top_matches?.map((match: any, idx: number) => (
              <JobCard key={idx} job={match} />
            ))}
          </div>

          {/* Tweaking guidelines */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-4">
            <h4 className="font-bold text-sm text-white border-b border-brand-border pb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-purple" />
              Strategic Resume Matching Tweaks
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {jobMatchReport.recommended_resume_tweaks?.map((tweak: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  <span>{tweak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default JobMatchingAgent;
