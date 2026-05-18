import React, { useState } from 'react';
import { useAgentStore } from '../store/agentStore';
import { api } from '../services/api';
import { Compass, BookOpen, Clock, BarChart2, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export const SkillGap: React.FC = () => {
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

  // Helper to draw a gorgeous, pure SVG lightweight custom radar graphic
  const renderSVGRadar = () => {
    const radarData = skillGapReport?.radar_chart_data;
    if (!radarData) return null;

    const categories = radarData.categories || ['Prog', 'SysDes', 'DB', 'Cloud', 'Comm'];
    const currents = radarData.current_scores || [60, 40, 50, 20, 70];
    const targets = radarData.target_scores || [90, 80, 85, 70, 80];

    const size = 300;
    const center = size / 2;
    const rMax = 100;
    const numPoints = categories.length;

    // Helper to convert polar coordinates to Cartesian
    const polarToCartesian = (angleIndex: number, value: number) => {
      const angle = (Math.PI * 2 * angleIndex) / numPoints - Math.PI / 2;
      const radius = (value / 100) * rMax;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y };
    };

    // Build grid polygons (100%, 75%, 50%, 25%)
    const gridPolys = [25, 50, 75, 100].map((levelVal) => {
      const points = Array.from({ length: numPoints })
        .map((_, i) => {
          const pt = polarToCartesian(i, levelVal);
          return `${pt.x},${pt.y}`;
        })
        .join(' ');
      return (
        <polygon
          key={levelVal}
          points={points}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      );
    });

    // Build Axis Lines
    const axisLines = Array.from({ length: numPoints }).map((_, i) => {
      const outerPt = polarToCartesian(i, 100);
      return (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={outerPt.x}
          y2={outerPt.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />
      );
    });

    // Build Current Polygon
    const currentPoints = currents
      .map((val: number, i: number) => {
        const pt = polarToCartesian(i, val);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');

    // Build Target Polygon
    const targetPoints = targets
      .map((val: number, i: number) => {
        const pt = polarToCartesian(i, val);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');

    // Text labels
    const labels = categories.map((cat: string, i: number) => {
      const pt = polarToCartesian(i, 115);
      const isLeft = pt.x < center;
      const isCenter = Math.abs(pt.x - center) < 10;
      const textAnchor = isCenter ? 'middle' : isLeft ? 'end' : 'start';

      return (
        <text
          key={i}
          x={pt.x}
          y={pt.y + 4}
          fill="#94a3b8"
          fontSize="9.5"
          fontWeight="bold"
          textAnchor={textAnchor}
          className="font-sans"
        >
          {cat}
        </text>
      );
    });

    return (
      <svg width="100%" height="320" viewBox={`0 0 ${size} ${size}`} className="mx-auto select-none overflow-visible">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0.0" />
          </radialGradient>
        </defs>
        {/* Glow Ring */}
        <circle cx={center} cy={center} r={rMax} fill="url(#radarGlow)" />

        {/* Web grids */}
        {gridPolys}
        {axisLines}

        {/* Target Poly */}
        <polygon
          points={targetPoints}
          fill="rgba(16, 185, 129, 0.08)"
          stroke="#10b981"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Current Poly */}
        <polygon
          points={currentPoints}
          fill="rgba(244, 63, 94, 0.06)"
          stroke="#f43f5e"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Label overlays */}
        {labels}

        {/* Current Nodes */}
        {currents.map((val: number, i: number) => {
          const pt = polarToCartesian(i, val);
          return <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />;
        })}

        {/* Target Nodes */}
        {targets.map((val: number, i: number) => {
          const pt = polarToCartesian(i, val);
          return <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />;
        })}
      </svg>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-brand-emerald';
    if (score >= 50) return 'text-brand-amber';
    return 'text-brand-rose';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-brand-emerald/10 border-brand-emerald/20';
    if (score >= 50) return 'bg-brand-amber/10 border-brand-amber/20';
    return 'bg-brand-rose/10 border-brand-rose/20';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          🛣️ Skill Gap & Learning Roadmap Agent
        </h2>
        <p className="text-brand-gray text-sm leading-relaxed">
          Input your skillset and map competency gaps against real market expectations. Generate detailed roadmaps complete with portfolio projects and clickable links.
        </p>
      </div>

      {/* Inputs Form card */}
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
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
                placeholder="e.g. Data Scientist"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Seniority Tier
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white transition-colors"
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
                Weekly Commitment: <span className="text-brand-purple font-extrabold">{hoursPerWeek} Hours</span>
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
            className="w-full bg-slate-900 border border-brand-border rounded-xl p-4 text-sm focus:outline-none focus:border-brand-purple text-white placeholder-slate-600 transition-colors resize-none"
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

      {/* Diagnostic Scorecard Result */}
      {skillGapReport && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 justify-between items-center ${getScoreBg(skillGapReport.gap_score)}`}>
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Gap Audit Complete
              </span>
              <h3 className="text-xl font-bold text-white">
                Readiness Level: <span className="text-brand-purple font-extrabold">{skillGapReport.readiness_level}</span>
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                {skillGapReport.motivational_message}
              </p>
            </div>
            
            <div className="flex items-center gap-6 bg-slate-950/40 p-4 rounded-xl border border-white/5">
              <div className="text-center pr-6 border-r border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                  Fit Match
                </span>
                <h4 className={`text-4xl font-extrabold ${getScoreColor(skillGapReport.gap_score)}`}>
                  {skillGapReport.gap_score}%
                </h4>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                  Est. Study time
                </span>
                <h4 className="text-xl font-bold text-slate-200 mt-2">
                  {skillGapReport.time_to_ready}
                </h4>
              </div>
            </div>
          </div>

          {/* Grid Layout: Visual Radar Graphic + Critical Missing details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual Radar Web Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-purple" />
                  Competency Vector Radar
                </h4>
                <div className="flex gap-4 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-rose block" /> Current</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-emerald block" /> Benchmark</span>
                </div>
              </div>
              
              <div className="py-2">
                {renderSVGRadar()}
              </div>
            </div>

            {/* Gap List Details */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <h4 className="font-bold text-base text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-purple" />
                Skills Gap Roster
              </h4>

              <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
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
                          <span className="text-[10px] bg-brand-rose/10 border border-brand-rose/20 text-brand-rose px-2 py-0.5 rounded">
                            Critical
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-brand-border/40 text-xs text-slate-300 space-y-3 bg-slate-950/40">
                          <p className="leading-relaxed">
                            <strong>Why Needed</strong>: {gap.why_needed}
                          </p>
                          <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-white/5">
                            <div>
                              <strong className="text-brand-emerald">Free Path</strong>:{' '}
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
            <h4 className="font-bold text-lg text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-purple" />
              Upskilling Learning Path
            </h4>

            <div className="space-y-6">
              {skillGapReport.learning_roadmap?.map((phase: any, index: number) => (
                <div
                  key={index}
                  className="bg-brand-card/40 border border-brand-border rounded-2xl p-6 relative overflow-hidden glass-panel"
                >
                  {/* Phase Marker */}
                  <div className="absolute top-0 left-0 bg-brand-purple text-white text-[10px] font-extrabold uppercase py-1 px-3.5 rounded-br-xl">
                    Phase {phase.phase || index + 1}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-brand-border/60 pb-4 mb-4 mt-2">
                    <div>
                      <h5 className="font-extrabold text-base text-slate-100">
                        {phase.phase_name}
                      </h5>
                      <p className="text-xs text-brand-gray mt-1">
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
