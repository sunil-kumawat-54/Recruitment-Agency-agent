import React, { useState } from 'react';
import { useAgentStore } from '../store/agentStore';
import { api } from '../services/api';
import { Award, Briefcase, MapPin, DollarSign, Compass, AlertTriangle, Check, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const JobMatching: React.FC = () => {
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
      toast.error('Failed to locate semantic job matches.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPercentageColor = (pct: number) => {
    if (pct >= 85) return 'text-brand-emerald';
    if (pct >= 70) return 'text-brand-amber';
    return 'text-brand-rose';
  };

  const getBorderColor = (pct: number) => {
    if (pct >= 85) return 'border-l-brand-emerald';
    if (pct >= 70) return 'border-l-brand-amber';
    return 'border-l-brand-rose';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          🎯 Job Matching Agent
        </h2>
        <p className="text-brand-gray text-sm leading-relaxed">
          Semantically evaluate your professional credentials against our active job index collections. Discover overall fit weights, compatibility gaps, and targeted apply tips.
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-brand-border/60 pb-3">
          Complete Your Career Profile Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Current or Target Position Title
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Years of Relevant Experience
              </label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
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
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Preferred Job Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
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
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
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
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
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

      {/* Matching Results list */}
      {jobMatchReport && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Stats */}
          <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-brand-border text-xs">
            <span>
              Total Semantic Matches Found:{' '}
              <strong className="text-brand-purple">{jobMatchReport.total_matches || 0}</strong>
            </span>
            <span>
              Overall Profile Market Demand:{' '}
              <strong className="text-brand-emerald">{jobMatchReport.market_demand || 'High'}</strong>
            </span>
          </div>

          {/* Jobs Feed */}
          <div className="space-y-6">
            {jobMatchReport.top_matches?.map((match: any, idx: number) => (
              <div
                key={idx}
                className={`bg-brand-card/40 border border-brand-border rounded-2xl p-6 border-l-4 ${getBorderColor(
                  match.match_percentage
                )} glass-panel space-y-6`}
              >
                {/* Job Metadata header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-purple" />
                      {match.job_title}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-xs text-brand-gray items-center">
                      <span>🏢 {match.company}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {match.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {match.salary_range}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                      Compatibility
                    </span>
                    <span className={`text-2xl font-black ${getPercentageColor(match.match_percentage)}`}>
                      {match.match_percentage}%
                    </span>
                  </div>
                </div>

                {/* Compatibility Breakdown details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-300">
                  <div className="space-y-4">
                    <div>
                      <strong className="text-slate-100 font-bold block mb-1.5">Fit Narrative</strong>
                      <p>{match.why_this_job}</p>
                    </div>

                    <div className="space-y-2.5">
                      <strong className="text-slate-100 font-bold block mb-1">Vector Weights Breakdown</strong>
                      {match.match_breakdown &&
                        Object.entries(match.match_breakdown).map(([category, val]: [string, any]) => (
                          <div key={category} className="space-y-1 text-[11px]">
                            <div className="flex justify-between font-semibold">
                              <span className="text-slate-400 capitalize">{category.replace('_', ' ')}</span>
                              <span className="text-slate-300">{val}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-white/5">
                              <div
                                className="bg-brand-purple h-full rounded-full transition-all duration-300"
                                style={{ width: `${val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-4 rounded-xl border border-brand-border/40 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <strong className="text-slate-100 font-bold block mb-1.5 flex items-center gap-1 text-brand-rose">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Key Hurdles & Gaps
                      </strong>
                      {match.potential_concerns?.map((concern: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-brand-rose font-bold">•</span>
                          <span>{concern}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-brand-purple/[0.02] border border-brand-purple/10 p-3 rounded-lg text-[11px] leading-relaxed italic text-brand-purple">
                      <strong>Apply strategy</strong>: "{match.application_tip}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resume Tweaks Recommendations */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-4">
            <h4 className="font-bold text-base text-white border-b border-brand-border pb-3 flex items-center gap-2">
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
