import React, { useState } from 'react';
import { useAgentStore } from '../../store/agentStore';
import { api } from '../../services/api';
import { SkillRadarChart } from '../shared/SkillRadarChart';
import { BookOpen, Clock, BarChart2, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export const SkillGapAgent: React.FC = () => {
  const { skillGapReport, setSkillGapReport, isLoading, setIsLoading } = useAgentStore();
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetLevel, setTargetLevel] = useState('Mid');
  const [timelineMonths, setTimelineMonths] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [currentSkillsInput, setCurrentSkillsInput] = useState('Python, SQL, REST APIs, Git');
  const [expandedGap, setExpandedGap] = useState<number | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await api.skills.gap({
        current_skills: currentSkillsInput,
        target_role: targetRole,
        target_level: targetLevel,
        timeline_months: timelineMonths,
        hours_per_week: hoursPerWeek,
      });
      setSkillGapReport(data);
      toast.success('Skill Gap analysis completed!');
    } catch (err: any) {
      console.error(err);
      toast.error('Competency calculation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-brand-emerald';
    if (score >= 50) return 'text-brand-amber';
    return 'text-brand-rose';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-brand-emerald/[0.01] border-brand-emerald/20';
    if (score >= 50) return 'bg-brand-amber/[0.01] border-brand-amber/20';
    return 'bg-brand-rose/[0.01] border-brand-rose/20';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          🛣️ Skill Gap & Learning Roadmap Agent
        </h2>
        <p className="text-brand-gray text-xs leading-relaxed max-w-2xl">
          Evaluate your current skill stack against concrete market expectations and map out week-by-week upskilling milestones complete with portfolio project ideas.
        </p>
      </div>

      {/* Input panel */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Target Role Position
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
                placeholder="e.g. Data Scientist"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Seniority Level
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Upskilling Timeline: <span className="text-brand-purple font-extrabold">{timelineMonths} Months</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={timelineMonths}
                onChange={(e) => setTimelineMonths(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-brand-purple border border-brand-border"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Weekly commitment: <span className="text-brand-purple font-extrabold">{hoursPerWeek} Hours</span>
              </label>
              <input
                type="range"
                min="2"
                max="40"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-brand-purple border border-brand-border"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Your Current Skills (comma-separated)
          </label>
          <textarea
            rows={2}
            value={currentSkillsInput}
            onChange={(e) => setCurrentSkillsInput(e.target.value)}
            className="w-full bg-slate-900 border border-brand-border rounded-xl p-4 text-xs focus:outline-none focus:border-brand-purple text-white placeholder-slate-600 transition-colors resize-none"
            placeholder="e.g. Python, Javascript, SQL"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !currentSkillsInput.trim()}
          className="w-full bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple/90 hover:to-indigo-600/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Calculate Competency Gaps'
          )}
        </button>
      </div>

      {/* Results details */}
      {skillGapReport && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 justify-between items-center ${getScoreBg(skillGapReport.gap_score)}`}>
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                Gap Audit Complete
              </span>
              <h3 className="text-lg font-bold text-white">
                Readiness Level: <span className="text-brand-purple font-extrabold">{skillGapReport.readiness_level}</span>
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {skillGapReport.motivational_message}
              </p>
            </div>
            
            <div className="flex items-center gap-6 bg-slate-950/40 p-4 rounded-xl border border-white/5 shrink-0">
              <div className="text-center pr-6 border-r border-white/5">
                <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                  Fit Match
                </span>
                <h4 className={`text-3xl font-extrabold ${getScoreColor(skillGapReport.gap_score)}`}>
                  {skillGapReport.gap_score}%
                </h4>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                  Est. Study time
                </span>
                <h4 className="text-base font-bold text-slate-200 mt-2">
                  {skillGapReport.time_to_ready}
                </h4>
              </div>
            </div>
          </div>

          {/* Grid Layout: Visual Radar + Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-purple" />
                  Competency Vector Radar
                </h4>
                <div className="flex gap-4 text-[9px] font-semibold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-rose block" /> Current</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-emerald block" /> Target</span>
                </div>
              </div>
              
              <SkillRadarChart
                categories={skillGapReport.radar_chart_data?.categories}
                currentScores={skillGapReport.radar_chart_data?.current_scores}
                targetScores={skillGapReport.radar_chart_data?.target_scores}
                size={280}
              />
            </div>

            {/* Gap List */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <h4 className="font-bold text-sm text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-purple" />
                Skills Gap Roster
              </h4>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {skillGapReport.critical_gaps?.map((gap: any, idx: number) => {
                  const isExpanded = expandedGap === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-brand-border rounded-xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setExpandedGap(isExpanded ? null : idx)}
                        className="w-full p-4 flex justify-between items-center text-left text-xs font-semibold text-slate-200"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-rose block" />
                          {gap.skill}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="text-[9px] bg-brand-rose/10 border border-brand-rose/20 text-brand-rose px-2 py-0.5 rounded">
                            Critical
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-brand-border/40 text-xs text-slate-300 space-y-3 bg-slate-950/40">
                          <p className="leading-relaxed">
                            <strong>Why Required</strong>: {gap.why_needed}
                          </p>
                          <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-white/5">
                            <div>
                              <strong className="text-brand-emerald">Free Resource</strong>:{' '}
                              <span className="italic text-slate-300">{gap.free_resource}</span>
                            </div>
                            <div>
                              <strong className="text-brand-purple">Paid Course</strong>:{' '}
                              <span className="italic text-slate-300">{gap.paid_resource}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chronological Learning Roadmap Phases */}
          <div className="space-y-6">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-purple" />
              Upskilling Learning Path
            </h4>

            <div className="space-y-6">
              {skillGapReport.learning_roadmap?.map((phase: any, index: number) => (
                <div
                  key={index}
                  className="bg-brand-card/40 border border-brand-border rounded-2xl p-6 relative overflow-hidden glass-panel"
                >
                  <div className="absolute top-0 left-0 bg-brand-purple text-white text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-br-xl">
                    Phase {phase.phase || index + 1}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-brand-border/60 pb-4 mb-4 mt-2">
                    <div>
                      <h5 className="font-extrabold text-sm text-slate-100">
                        {phase.phase_name}
                      </h5>
                      <p className="text-[10px] text-brand-gray mt-1">
                        Skills focused: {phase.skills_to_learn?.join(', ')}
                      </p>
                    </div>
                    <div className="bg-slate-900 border border-brand-border rounded-xl px-3.5 py-2 shrink-0 flex items-center gap-2 text-xs font-semibold">
                      <Clock className="w-4 h-4 text-brand-purple" />
                      <span>Duration: {phase.duration}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
                    <div className="space-y-2">
                      <strong className="text-slate-100 font-bold block mb-1">Weekly Task Checklist</strong>
                      {phase.daily_tasks?.map((task: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-emerald mt-0.5 shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 bg-slate-900/40 p-4 rounded-xl border border-brand-border/40">
                      <div>
                        <strong className="text-slate-100 font-bold block mb-1">🎯 Major Milestone</strong>
                        <span>{phase.milestone}</span>
                      </div>
                      <div>
                        <strong className="text-brand-purple font-bold block mb-1">📁 Practice Portfolio Project</strong>
                        <span className="italic">"{phase.project_to_build}"</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SkillGapAgent;
