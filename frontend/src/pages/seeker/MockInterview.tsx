import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const MockInterview = () => {
  const [started, setStarted] = useState(false);
  const [role, setRole] = useState('Software Engineer');
  const [level, setLevel] = useState('Mid');
  const [round, setRound] = useState('Technical Round');
  
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [chat, setChat] = useState<{role: string, text: string, type?: 'q' | 'a' | 'fb'}[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);

  const mockQuestions = [
    "Can you describe a challenging technical problem you solved recently?",
    "How do you handle disagreements with your product manager?",
  ];

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [started, timeLeft]);

  const handleStart = () => {
    setStarted(true);
    setChat([{ role: 'ai', text: `Welcome to your ${round} for ${level} ${role}. Let's begin. Question 1: ${mockQuestions[0]}`, type: 'q' }]);
    setTimeLeft(120);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const newChat = [...chat, { role: 'user', text: answer, type: 'a' }];
    setChat(newChat);
    setAnswer('');
    
    setTimeout(() => {
      setChat(prev => [
        ...prev, 
        { role: 'ai', text: "Score: 7/10. Good response using the STAR method, but could have elaborated more on the measurable impact.", type: 'fb' }
      ]);
      
      if (currentQ < mockQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQ(q => q + 1);
          setChat(p => [...p, { role: 'ai', text: `Question ${currentQ + 2}: ${mockQuestions[currentQ + 1]}`, type: 'q' }]);
          setTimeLeft(120);
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-['Plus_Jakarta_Sans'] flex">
      {!started ? (
        <div className="m-auto w-full max-w-md bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">🎤 Setup Mock Interview</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Target Role</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Experience Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 focus:border-indigo-500 focus:outline-none">
                <option>Junior</option><option>Mid</option><option>Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Round Type</label>
              <select value={round} onChange={e => setRound(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 focus:border-indigo-500 focus:outline-none">
                <option>Technical Round</option><option>HR Round</option><option>Case Study</option>
              </select>
            </div>
            <button onClick={handleStart} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-bold mt-6 shadow-[0_4px_24px_rgba(79,70,229,0.3)] transition-colors">Start Interview</button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto flex flex-col h-screen p-6">
          <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
            <div>
              <h2 className="font-bold text-lg">{role} - {round}</h2>
              <p className="text-sm text-slate-400">Question {currentQ + 1} of {mockQuestions.length}</p>
            </div>
            <div className={`text-xl font-mono font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {chat.map((msg, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 rounded-tr-sm shadow-lg' : msg.type === 'fb' ? 'bg-slate-700 border border-amber-500/50 rounded-tl-sm text-amber-100' : 'bg-slate-800 border border-slate-600 rounded-tl-sm shadow-md'}`}>
                  {msg.role === 'ai' && <span className="mr-2">{msg.type === 'fb' ? '💡' : '🤖'}</span>}
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl">
            <textarea 
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here using the STAR method..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white h-32 focus:outline-none focus:border-indigo-500 resize-none mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">{answer.length} characters</span>
              <button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-6 py-2 rounded-lg font-bold shadow-lg transition-colors">Submit Answer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
