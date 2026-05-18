import React from 'react';
import { useAgentStore } from '../../store/agentStore';
import { User, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { candidateName } = useAgentStore();

  return (
    <header className="h-16 border-b border-brand-border bg-brand-dark/40 backdrop-blur-md px-8 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-brand-gray">Session:</span>
        <span className="text-xs font-semibold text-white bg-slate-900 border border-brand-border px-2.5 py-1 rounded-lg">
          Candidate Pipeline Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-brand-border pl-3 pr-2.5 py-1 rounded-xl">
          <div className="text-right">
            <p className="text-xs font-bold text-white leading-none">{candidateName}</p>
            <span className="text-[9px] text-slate-500 leading-none">Job Seeker</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
