import React, { useState } from 'react';
import { useAgentStore } from '../../store/agentStore';
import { api } from '../../services/api';
import { DollarSign, MessageSquare, Mail, Copy, Check, TrendingUp, AlertOctagon } from 'lucide-react';
import toast from 'react-hot-toast';

export const SalaryAgent: React.FC = () => {
  const { salaryReport, setSalaryReport, isLoading, setIsLoading } = useAgentStore();
  const [role, setRole] = useState('Software Engineer');
  const [experience, setExperience] = useState(3);
  const [location, setLocation] = useState('Bangalore');
  const [skills, setSkills] = useState('Python, SQL, REST APIs, Git');
  const [currentCTC, setCurrentCTC] = useState('12 LPA');
  const [receivedOffer, setReceivedOffer] = useState('16 LPA');
  const [isCopied, setIsCopied] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await api.salary.guide({
        role,
        years_experience: experience,
        location,
        skills,
        current_ctc: currentCTC,
        received_offer: receivedOffer,
      });
      setSalaryReport(data);
      toast.success('Negotiation benchmarks compiled!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to resolve compensation data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (!salaryReport?.email_template) return;
    navigator.clipboard.writeText(salaryReport.email_template);
    setIsCopied(true);
    toast.success('Offer response email copied!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('under')) return 'text-brand-rose';
    if (v.includes('fair') || v.includes('over')) return 'text-brand-emerald';
    return 'text-brand-amber';
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          💰 Salary & Negotiation Guide Agent
        </h2>
        <p className="text-brand-gray text-xs leading-relaxed max-w-2xl">
          Evaluate received offers against localized city multipliers. Extract structural value talking statements and professional written responses.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-brand-border/60 pb-3">
          Provide Offer Assessment Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Job Position Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
                Location (City / Country)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Current Compensation (Optional)
              </label>
              <input
                type="text"
                value={currentCTC}
                onChange={(e) => setCurrentCTC(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
                placeholder="e.g. 12 LPA"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Received Offer Compensation (Optional)
              </label>
              <input
                type="text"
                value={receivedOffer}
                onChange={(e) => setReceivedOffer(e.target.value)}
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-purple text-white transition-colors"
                placeholder="e.g. 16 LPA"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Core Tech Skills
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
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple/90 hover:to-indigo-600/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Generate Negotiation Script & Guide'
          )}
        </button>
      </div>

      {/* Reports Panel */}
      {salaryReport && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-brand-border text-center">
              <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                Compensation Verdict
              </span>
              <span className={`text-xl font-black ${getVerdictColor(salaryReport.negotiation_verdict)}`}>
                {salaryReport.negotiation_verdict}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-brand-border text-center">
              <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                Your Calculated Market Value
              </span>
              <span className="text-lg font-black text-brand-emerald">
                {formatNumber(salaryReport.your_market_value)} {salaryReport.market_salary_range?.currency || 'INR'}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-brand-border text-center">
              <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">
                Recommended Ask Anchor
              </span>
              <span className="text-lg font-black text-brand-purple">
                {formatNumber(salaryReport.recommended_ask)} {salaryReport.market_salary_range?.currency || 'INR'}
              </span>
            </div>
          </div>

          {/* Ranges & Targets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-300">
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <h4 className="font-bold text-sm text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-purple" />
                Industry Range Benchmarks
              </h4>

              <div className="space-y-3.5">
                <div className="flex justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-slate-400">Minimum Range Limit</span>
                  <span className="text-slate-200 font-bold">
                    {formatNumber(salaryReport.market_salary_range?.minimum)}{' '}
                    {salaryReport.market_salary_range?.currency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-slate-400">Median Standard Range</span>
                  <span className="text-slate-200 font-bold">
                    {formatNumber(salaryReport.market_salary_range?.median)}{' '}
                    {salaryReport.market_salary_range?.currency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-slate-400">Maximum Top Percentile</span>
                  <span className="text-slate-200 font-bold">
                    {formatNumber(salaryReport.market_salary_range?.maximum)}{' '}
                    {salaryReport.market_salary_range?.currency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-slate-400">Market Segment Trend</span>
                  <span className="text-brand-emerald font-semibold">{salaryReport.market_trend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guidance Confidence</span>
                  <span className="text-slate-200 font-semibold">{salaryReport.confidence_level}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <h4 className="font-bold text-sm text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-purple" />
                Compensation Anchoring Targets
              </h4>

              <div className="space-y-3.5">
                <div className="flex justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-slate-400">Starting Anchor Point</span>
                  <span className="text-brand-purple font-extrabold">
                    {formatNumber(salaryReport.negotiation_strategy?.opening_number)}{' '}
                    {salaryReport.market_salary_range?.currency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-slate-400">Ideal Outcome target</span>
                  <span className="text-slate-200 font-bold">
                    {formatNumber(salaryReport.negotiation_strategy?.ideal_outcome)}{' '}
                    {salaryReport.market_salary_range?.currency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-brand-border/40 pb-2">
                  <span className="text-slate-400">Walkaway Absolute Minimum</span>
                  <span className="text-brand-rose font-bold">
                    {formatNumber(salaryReport.negotiation_strategy?.minimum_acceptable)}{' '}
                    {salaryReport.market_salary_range?.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Negotiating Blueprint</span>
                  <span className="text-slate-200 font-semibold">
                    {salaryReport.negotiation_strategy?.strategy_name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scripts playbook & counter offer emails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-300">
            {/* Conversation playbooks */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <h4 className="font-bold text-sm text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-purple" />
                Negotiation Verbal Playbook
              </h4>

              <div className="space-y-4">
                <div>
                  <span className="font-bold text-brand-emerald block mb-2">Effective Statements (Phrases to Say)</span>
                  <ul className="space-y-2">
                    {salaryReport.phrases_to_use?.map((phrase: string, i: number) => (
                      <li key={i} className="bg-brand-emerald/[0.01] border border-brand-emerald/10 p-2.5 rounded-lg italic text-slate-200">
                        "{phrase}"
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-brand-rose block mb-2 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    Ineffective Statements (Phrases to Avoid)
                  </span>
                  <ul className="space-y-2">
                    {salaryReport.phrases_to_avoid?.map((phrase: string, i: number) => (
                      <li key={i} className="bg-brand-rose/[0.01] border border-brand-rose/10 p-2.5 rounded-lg italic text-slate-400 line-through">
                        "{phrase}"
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <span className="font-extrabold text-slate-100 block mb-2">
                    Non-Salary Benefits to Target
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {salaryReport.non_salary_benefits_to_negotiate?.map((benefit: string) => (
                      <span key={benefit} className="bg-slate-900 border border-brand-border px-2.5 py-1 rounded-lg text-[9px] font-semibold">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Email draft counters */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-purple" />
                  Counter-Offer Email Draft
                </h4>
                <button
                  onClick={handleCopyEmail}
                  className="bg-slate-900 hover:bg-slate-800 border border-brand-border p-2 rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-brand-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={salaryReport.email_template}
                className="w-full bg-slate-950/70 border border-brand-border/80 rounded-xl p-4 text-[10px] font-mono leading-relaxed text-slate-300 h-96 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SalaryAgent;
