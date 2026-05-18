import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, ChevronDown, ChevronUp, AlertTriangle, Check, BookOpen } from 'lucide-react';

interface JobCardProps {
  job: {
    job_title: string;
    company: string;
    location: string;
    salary_range: string;
    match_percentage: number;
    why_this_job?: string;
    match_breakdown?: Record<string, number>;
    potential_concerns?: string[];
    application_tip?: string;
  };
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    <div
      className={`bg-brand-card/40 border border-brand-border rounded-2xl border-l-4 ${getBorderColor(
        job.match_percentage
      )} glass-panel overflow-hidden transition-all duration-300`}
    >
      {/* Primary header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-start text-left gap-4 hover:bg-slate-900/10 transition-colors"
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-purple" />
            {job.job_title}
          </h4>
          <div className="flex flex-wrap gap-4 text-xs text-brand-gray items-center">
            <span className="font-semibold text-slate-300">🏢 {job.company}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              {job.salary_range}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-widest block mb-0.5">
              Profile Compatibility
            </span>
            <span className={`text-xl font-black ${getPercentageColor(job.match_percentage)}`}>
              {job.match_percentage}%
            </span>
          </div>
          <div className="p-1.5 bg-slate-900 border border-brand-border rounded-lg text-brand-gray">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Accordion detail pane */}
      {isOpen && (
        <div className="p-5 border-t border-brand-border/60 bg-slate-950/40 text-xs leading-relaxed text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* Fit parameters */}
          <div className="space-y-4">
            <div>
              <strong className="text-slate-100 font-bold block mb-1">Semantic Fit Explanation</strong>
              <p className="text-slate-300">{job.why_this_job || 'Excellent fit with technical experience benchmarks.'}</p>
            </div>

            {job.match_breakdown && (
              <div className="space-y-2">
                <strong className="text-slate-100 font-bold block mb-1">Vector Weight Metrics</strong>
                {Object.entries(job.match_breakdown).map(([cat, val]) => (
                  <div key={cat} className="space-y-1 text-[10px]">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-400 capitalize">{cat.replace(/_/g, ' ')}</span>
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
            )}
          </div>

          {/* Hurdles and recommendations */}
          <div className="space-y-4 bg-slate-900/40 p-4 rounded-xl border border-brand-border/40 flex flex-col justify-between">
            <div className="space-y-2">
              <strong className="text-slate-100 font-bold block mb-1.5 flex items-center gap-1 text-brand-rose">
                <AlertTriangle className="w-3.5 h-3.5" />
                Key Hurdles & Competency Gaps
              </strong>
              {job.potential_concerns && job.potential_concerns.length > 0 ? (
                job.potential_concerns.map((concern, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-brand-rose font-bold">•</span>
                    <span>{concern}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-400">No major hurdle points discovered. Proceed with active application.</span>
              )}
            </div>

            {job.application_tip && (
              <div className="bg-brand-purple/[0.02] border border-brand-purple/10 p-3 rounded-lg text-[10px] leading-relaxed italic text-brand-purple">
                <strong>Target Apply Strategy</strong>: "{job.application_tip}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
