import React from 'react';

export const BulkATS = () => {
  const candidates = [
    { name: 'Alice Smith', score: 92, grade: 'A+', skills: 'React, Node.js' },
    { name: 'Bob Jones', score: 75, grade: 'B', skills: 'Vue, PHP' },
    { name: 'Charlie Day', score: 45, grade: 'D', skills: 'HTML, CSS' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-['Plus_Jakarta_Sans']">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📁 Bulk ATS Analyzer</h1>
        <p className="text-slate-400 mb-8">Process dozens of resumes simultaneously against a single job description.</p>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 shadow-xl">
          <label className="block text-sm text-slate-300 mb-2">Target Job Description</label>
          <textarea className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm h-24 mb-4 focus:border-indigo-500 focus:outline-none" placeholder="Paste full JD here..."></textarea>
          
          <div className="border-2 border-dashed border-slate-600 bg-slate-900/50 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/10 transition-all mb-4">
            <p className="text-slate-300">Select multiple PDF/DOCX files to scan</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-2 rounded-lg font-bold w-full md:w-auto shadow-[0_4px_24px_rgba(79,70,229,0.3)]">Run Bulk Analysis</button>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
            <h2 className="font-bold">Results ({candidates.length})</h2>
            <button className="text-sm bg-slate-700 hover:bg-slate-600 transition-colors px-3 py-1 rounded border border-slate-600">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="p-4 font-semibold">Candidate Name</th>
                  <th className="p-4 font-semibold">ATS Score</th>
                  <th className="p-4 font-semibold">Grade</th>
                  <th className="p-4 font-semibold">Key Skills Found</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/40 transition-colors">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${c.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : c.score >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                        {c.score}/100
                      </span>
                    </td>
                    <td className="p-4 font-bold">{c.grade}</td>
                    <td className="p-4 text-slate-400 truncate max-w-[200px]">{c.skills}</td>
                    <td className="p-4">
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
