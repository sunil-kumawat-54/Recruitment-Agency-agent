import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAgentStore } from '../store/agentStore';
import { api } from '../services/api';
import { UploadCloud, CheckCircle2, AlertTriangle, Lightbulb, Check, X, FileText, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResumeAnalyzer: React.FC = () => {
  const { resumeReport, setResumeReport, isLoading, setIsLoading } = useAgentStore();
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      toast.success(`Loaded file: ${acceptedFiles[0].name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please upload a resume file first.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.resume.analyze(selectedFile, targetRole);
      setResumeReport(data);
      toast.success('ATS Analysis completed!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Resume analysis failed. Running backup scores.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-brand-emerald';
    if (score >= 60) return 'text-brand-amber';
    return 'text-brand-rose';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-brand-emerald/10 border-brand-emerald/20';
    if (score >= 60) return 'bg-brand-amber/10 border-brand-amber/20';
    return 'bg-brand-rose/10 border-brand-rose/20';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          📄 Resume Analyzer Agent
        </h2>
        <p className="text-brand-gray text-sm leading-relaxed">
          Verify your resume ATS readability, extract missing skills, and unlock high-impact suggestions to score in the top 5% of candidate matches.
        </p>
      </div>

      {/* Control Card */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Target Career Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple text-white placeholder-slate-600 transition-colors"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !selectedFile}
            className="w-full bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-purple/90 hover:to-indigo-600/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-white" />
            )}
            Run ATS Diagnostic
          </button>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-brand-purple bg-brand-purple/5'
              : selectedFile
              ? 'border-brand-emerald bg-brand-emerald/[0.02]'
              : 'border-brand-border hover:border-brand-purple/40 hover:bg-slate-900/20'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-3">
            {selectedFile ? (
              <div className="p-3 bg-brand-emerald/10 rounded-2xl border border-brand-emerald/20 text-brand-emerald">
                <FileText className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-3 bg-slate-900 rounded-2xl border border-brand-border text-brand-purple">
                <UploadCloud className="w-8 h-8" />
              </div>
            )}
            <div>
              <p className="text-slate-200 font-semibold text-sm">
                {selectedFile ? selectedFile.name : 'Drag & drop your resume here'}
              </p>
              <p className="text-xs text-brand-gray mt-1">
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB | Click to swap file`
                  : 'Supports PDF or DOCX format (Max size 10MB)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      {resumeReport && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 justify-between items-center ${getScoreBg(resumeReport.ats_score)}`}>
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Diagnostic Match Complete
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                Target Role: <span className="text-brand-purple font-extrabold">{targetRole}</span>
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                {resumeReport.summary_feedback}
              </p>
            </div>
            
            <div className="flex items-center gap-6 bg-slate-950/40 p-4 rounded-xl border border-white/5">
              <div className="text-center pr-6 border-r border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest">
                  Score Match
                </span>
                <h4 className={`text-4xl font-extrabold ${getScoreColor(resumeReport.ats_score)}`}>
                  {resumeReport.ats_score}
                </h4>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest">
                  ATS Grade
                </span>
                <h4 className="text-4xl font-extrabold text-slate-200">
                  {resumeReport.grade}
                </h4>
              </div>
            </div>
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Found & Missing Keywords */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <h4 className="font-bold text-base text-white border-b border-brand-border pb-3">
                🔑 Keyword Mirroring Check
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-extrabold uppercase text-brand-emerald tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Found Keywords ({resumeReport.keyword_analysis?.found_keywords?.length || 0})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {resumeReport.keyword_analysis?.found_keywords?.map((kw: string) => (
                      <span key={kw} className="bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs px-2.5 py-1 rounded-lg">
                        {kw}
                      </span>
                    )) || <span className="text-xs text-brand-gray">None</span>}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-extrabold uppercase text-brand-rose tracking-wider mb-2.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Critical Keywords ({resumeReport.keyword_analysis?.missing_critical_keywords?.length || 0})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {resumeReport.keyword_analysis?.missing_critical_keywords?.map((kw: string) => (
                      <span key={kw} className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose text-xs px-2.5 py-1 rounded-lg">
                        {kw}
                      </span>
                    )) || <span className="text-xs text-brand-gray">None</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Breakdown Scores */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-border space-y-6">
              <h4 className="font-bold text-base text-white border-b border-brand-border pb-3">
                📶 Section Match breakdown
              </h4>
              <div className="space-y-4">
                {resumeReport.section_scores &&
                  Object.entries(resumeReport.section_scores).map(([section, val]: [string, any]) => (
                    <div key={section} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300 capitalize">{section.replace('_', ' ')}</span>
                        <span className="text-slate-400">{val}/100</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 border border-brand-border overflow-hidden">
                        <div
                          className="bg-brand-purple h-full rounded-full transition-all duration-300"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Actionable Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Key Strengths */}
            <div className="bg-brand-emerald/[0.02] p-5 rounded-2xl border border-brand-emerald/10 space-y-4">
              <h5 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-emerald" />
                Key Strengths
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {resumeReport.strengths?.map((str: string, i: number) => (
                  <li key={i} className="leading-relaxed flex items-start gap-2">
                    <span className="text-brand-emerald font-bold">•</span>
                    {str}
                  </li>
                )) || <li>No criteria returned.</li>}
              </ul>
            </div>

            {/* Critical Gaps */}
            <div className="bg-brand-rose/[0.02] p-5 rounded-2xl border border-brand-rose/10 space-y-4">
              <h5 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <X className="w-4 h-4 text-brand-rose" />
                Critical Gaps
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {resumeReport.critical_improvements?.map((gap: string, i: number) => (
                  <li key={i} className="leading-relaxed flex items-start gap-2">
                    <span className="text-brand-rose font-bold">•</span>
                    {gap}
                  </li>
                )) || <li>None identified.</li>}
              </ul>
            </div>

            {/* Quick Wins */}
            <div className="bg-brand-amber/[0.02] p-5 rounded-2xl border border-brand-amber/10 space-y-4">
              <h5 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-brand-amber" />
                Quick Wins
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {resumeReport.quick_wins?.map((win: string, i: number) => (
                  <li key={i} className="leading-relaxed flex items-start gap-2">
                    <span className="text-brand-amber font-bold">•</span>
                    {win}
                  </li>
                )) || <li>None identified.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
