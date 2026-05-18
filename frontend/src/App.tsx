import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { SeekerDashboard } from './pages/seeker/SeekerDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { Toaster } from 'react-hot-toast';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-brand-dark min-h-screen font-sans selection:bg-brand-purple/30 selection:text-white">
        {/* Hot Toasts Container */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-slate-900 border border-brand-border text-xs text-slate-100 rounded-xl',
            duration: 3000,
          }}
        />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/seeker" element={<SeekerDashboard />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
