import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 border-t border-brand-border/40 mt-12 text-center text-[10px] text-slate-500 font-medium">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-3">
        <p>© 2026 HireIQ — AI Recruitment Agency Platform. Pinned persistent vectors.</p>
        <p className="flex items-center gap-3">
          <span>Engine: <strong className="text-brand-purple">Gemini 1.5 Flash</strong></span>
          <span className="text-brand-border">•</span>
          <span>Database: <strong className="text-brand-emerald">ChromaDB Local</strong></span>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
