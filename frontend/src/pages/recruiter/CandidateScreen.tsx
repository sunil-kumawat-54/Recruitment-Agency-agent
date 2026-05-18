import React, { useState } from 'react';
import { ATSScoreGauge } from '../../components/shared/ATSScoreGauge';
import { Award, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface CandidateScreenProps {
  screenedCandidates: any[];
}

export const CandidateScreen: React.FC<CandidateScreenProps> = ({ screenedCandidates }) => {
  const [selectedCandIdx, setSelectedCandIdx] = useState<number>(0);

  // Fallback candidate if none uploaded yet
  const defaultCands = [
    {
      name: 'Rahul Sharma',
      filename: 'Rahul_Sharma_Resume.pdf',
      ats_score: 85,
      grade: 'A',
      found_keywords: ['Python', 'SQL', 'REST APIs', 'Git', 'Docker', 'Postgres'],
      missing_keywords: ['AWS', 'Kubernetes'],
      report: {
        summary_feedback: 'Outstanding modern candidate with excellent microservices, Relational querying, and Git orchestration foundations. Excellent alignment with technical benchmarks.',
        strengths: ['Expert Python backend development', 'Clean relational schema design', 'Comprehensive testing setups'],
        critical_improvements: ['Quantify product metric results', 'Describe cloud server staging environments'],
        quick_wins: ['Insert tags like AWS or GCP in containerization sections'],
      },
    },
    {
      name: 'Aditi Verma',
      filename: 'Aditi_Verma_CV.docx',
      ats_score: 76,
      grade: 'B',
      found_keywords: ['Python', 'SQL', 'Git', 'Javascript'],
      missing_keywords: ['Docker', 'REST APIs'],
      report: {
        summary_feedback: 'Solid resume. Needs stronger focus on backend routing paradigms and microservices containerization.',
        strengths: ['Strong scripting credentials', 'Solid front-end JS integration skills'],
        critical_improvements: ['Add containerization profiles (Docker)', 'Expand API structure explanations'],
        quick_wins: ['List API endpoint tools used (FastAPI/Flask)'],
      },
    },
  ];

  const activePool = screenedCandidates.length > 0 ? screenedCandidates : defaultCands;
  const cand = activePool[selectedCandIdx] || activePool[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Selector dropdown */}
      <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Candidate Profile to Audit
          </label>
          <select
            value={selectedCandIdx}
            onChange={(e) => setSelectedCandIdx(Number(e.target.value))}
            className="bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors min-w-[200px]"
          >
            {activePool.map((c, i) => (
              <option key={i} value={i}>
                {c.name} ({c.ats_score}%)
              </option>
            ))}
          </select>
        </div>

        <div className="text-right text-[10px] text-slate-500 font-medium">
          Source document: <strong className="text-slate-300 font-mono">{cand.filename}</strong>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-brand-card/40 border border-brand-border rounded-2xl p-6 relative overflow-hidden glass-panel flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-3.5 flex-1 text-center md:text-left">
          <span className="text-[9px] uppercase font-bold tracking-widest text-brand-emerald">
            Candidate Diagnostic Profile
          </span>
          <h3 className="text-2xl font-black text-white">{cand.name}</h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {cand.report?.summary_feedback || 'Excellent profile foundations.'}
          </p>
        </div>

        <div className="shrink-0 bg-slate-950/60 p-5 rounded-2xl border border-white/5">
          <ATSScoreGauge score={cand.ats_score} grade={cand.grade} size={130} />
        </div>
      </div>

      {/* Keywords Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
          <h4 className="font-bold text-sm text-white border-b border-brand-border pb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
            Found Tech Competencies ({cand.found_keywords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {cand.found_keywords.map((kw: string) => (
              <span key={kw} className="bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs px-2.5 py-1 rounded-lg font-semibold">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
          <h4 className="font-bold text-sm text-white border-b border-brand-border pb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-rose" />
            Missing Tech Gaps ({cand.missing_keywords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {cand.missing_keywords.map((kw: string) => (
              <span key={kw} className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose text-xs px-2.5 py-1 rounded-lg font-semibold">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Details checklist bullet suggestion lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
        <div className="bg-brand-emerald/[0.01] p-5 rounded-2xl border border-brand-emerald/10 space-y-3.5">
          <h5 className="font-bold text-xs text-slate-100 flex items-center gap-2">
            🌟 Strategic Strengths
          </h5>
          <ul className="space-y-2">
            {cand.report?.strengths?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-brand-emerald font-bold">•</span>
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-brand-rose/[0.01] p-5 rounded-2xl border border-brand-rose/10 space-y-3.5">
          <h5 className="font-bold text-xs text-slate-100 flex items-center gap-2">
            ⚠️ Gaps & Hurdle Points
          </h5>
          <ul className="space-y-2">
            {cand.report?.critical_improvements?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-brand-rose font-bold">•</span>
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-brand-amber/[0.01] p-5 rounded-2xl border border-brand-amber/10 space-y-3.5">
          <h5 className="font-bold text-xs text-slate-100 flex items-center gap-2">
            💡 Resume Improvement wins
          </h5>
          <ul className="space-y-2">
            {cand.report?.quick_wins?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-brand-amber font-bold">•</span>
                {str}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CandidateScreen;
