import React, { useState } from 'react';
import { ChatWindow } from '../../components/shared/ChatWindow';
import { Sparkles, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIDiscussionProps {
  screenedCandidates: any[];
}

export const AIDiscussion: React.FC<AIDiscussionProps> = ({ screenedCandidates }) => {
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; senderName?: string }>>([
    {
      role: 'assistant',
      content: 'Welcome to your AI Pipeline Advisory board! Paste or type candidate comparison queries (e.g. "Who has more Python experience?" or "Draft counter offer strategy for Rahul").',
      senderName: 'AI Pipeline Advisor',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (text: string) => {
    // 1. Append user query
    setChatMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    setTimeout(() => {
      const names = screenedCandidates.map(c => c.name).join(' and ');
      let reply = `Auditing active profiles: ${names || 'No candidates loaded yet'}.\n\n`;

      if (text.toLowerCase().includes('compare') || text.toLowerCase().includes('who')) {
        if (screenedCandidates.length > 0) {
          const top = screenedCandidates[0];
          const runner = screenedCandidates[1] || { name: 'Aditi Verma', ats_score: 75, grade: 'B', found_keywords: ['Python'] };
          reply += `1. **${top.name}** leads the board with an ATS compatibility of **${top.ats_score}%** (Grade: ${top.grade}). Key strengths: ${top.found_keywords.slice(0, 4).join(', ')}.\n2. **${runner.name}** stands out in relational schema setups, scoring **${runner.ats_score}%** (Grade: ${runner.grade}).\n\nRecommendation: Prioritize interviews with ${top.name} for modern microservices backend engineering.`;
        } else {
          reply += 'I discovered some mock credentials:\n\n1. **Rahul Sharma** (ATS Score: 85%) leads in Python/AWS query indexing.\n2. **Aditi Verma** (ATS Score: 78%) shows solid frontend framework alignment.\n\nI highly suggest moving Rahul to the coding mock session first.';
        }
      } else {
        reply += 'Based on our seed qualifications, the top candidates demonstrate excellent foundations in REST API routing structures and GIT version control workflows. Let me know if you would like me to draft an initial assessment recap email.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          senderName: 'AI Pipeline Advisor',
        },
      ]);
      setIsLoading(false);
      toast.success('AI Audit complete!');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {screenedCandidates.length === 0 && (
        <div className="bg-brand-amber/10 border border-brand-amber/20 rounded-xl p-4 flex items-center gap-3 text-xs text-brand-amber leading-relaxed">
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span>
            <strong>Pro Tip</strong>: You have not screened any candidates in this session yet. I will answer queries using the system standard seeded RAG databases!
          </span>
        </div>
      )}

      {/* Chat window assembly */}
      <ChatWindow
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        inputPlaceholder={screenedCandidates.length === 0 ? 'Ask about standard seeded job pools...' : 'Ask comparative queries...'}
        isLoading={isLoading}
        themeColor="emerald"
      />
    </div>
  );
};
export default AIDiscussion;
