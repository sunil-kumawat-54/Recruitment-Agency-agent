import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useAgentStore } from '../../store/agentStore';
import { analyzeResume } from '../../services/api';

export default function ResumeAnalysis() {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const { resumeAnalysis, setAnalysisResult, isLoading, setLoading, setError } = useAgentStore();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(acceptedFiles[0], targetRole);
      setAnalysisResult('resumeAnalysis', result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 
      'application/pdf': ['.pdf'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
    } 
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-['Plus_Jakarta_Sans']">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📄 AI Resume Analyzer</h1>
        <p className="text-slate-400 mb-8">Upload your resume to get an elite ATS score and feedback.</p>

        {!resumeAnalysis && !isLoading && (
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
              <input 
                type="text" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-indigo-400'}`}
            >
              <input {...getInputProps()} />
              <div className="text-4xl mb-4">☁️</div>
              <p className="text-lg font-medium">Drag & drop your resume here</p>
              <p className="text-slate-400 text-sm mt-2">Supports PDF and DOCX files</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg text-slate-300 animate-pulse">Analyzing against ATS algorithms...</p>
          </div>
        )}

        {resumeAnalysis && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                <h3 className="text-slate-400 mb-2">ATS Score</h3>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-6xl font-bold ${resumeAnalysis.ats_score >= 80 ? 'text-emerald-500' : resumeAnalysis.ats_score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                  {resumeAnalysis.ats_score}
                </motion.div>
                <div className="mt-2 text-xl font-semibold">Grade: {resumeAnalysis.grade}</div>
              </div>
              <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="font-bold mb-4">Section Scores</h3>
                {Object.entries(resumeAnalysis.section_scores || {}).map(([key, val]: any) => (
                  <div key={key} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                      <span>{val}/100</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
              <h3 className="font-bold mb-4">Keyword Match Analysis</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {resumeAnalysis.keyword_analysis?.found_keywords?.map((k: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30">{k}</span>
                ))}
                {resumeAnalysis.keyword_analysis?.missing_critical_keywords?.map((k: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">{k}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                 <h3 className="font-bold mb-4 text-emerald-400">Strengths & Quick Wins</h3>
                 <ul className="space-y-2 text-sm text-slate-300">
                   {resumeAnalysis.quick_wins?.map((q: string, i: number) => <li key={i}>✅ {q}</li>)}
                   {resumeAnalysis.strengths?.map((s: string, i: number) => <li key={i}>⭐ {s}</li>)}
                 </ul>
               </div>
               <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                 <h3 className="font-bold mb-4 text-amber-400">Critical Improvements</h3>
                 <ul className="space-y-2 text-sm text-slate-300">
                   {resumeAnalysis.critical_improvements?.map((c: string, i: number) => <li key={i}>⚠️ {c}</li>)}
                 </ul>
               </div>
            </div>

            <div className="flex justify-end mt-4">
               <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-semibold shadow-[0_4px_24px_rgba(79,70,229,0.3)] transition-colors" onClick={() => {
                  const blob = new Blob([JSON.stringify(resumeAnalysis, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `resume_analysis_${targetRole.replace(' ', '_')}.json`;
                  a.click();
               }}>
                 Download JSON Report
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
