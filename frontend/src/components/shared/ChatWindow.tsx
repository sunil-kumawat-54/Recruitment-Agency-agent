import React, { useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  senderName?: string;
  statusLabel?: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  inputPlaceholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  themeColor?: 'purple' | 'emerald';
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  inputPlaceholder = 'Type your message...',
  disabled = false,
  isLoading = false,
  themeColor = 'purple'
}) => {
  const [inputText, setInputText] = React.useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !disabled && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const activeColor = themeColor === 'emerald' ? 'bg-brand-emerald text-brand-dark' : 'bg-brand-purple text-white';
  const inputBorderFocus = themeColor === 'emerald' ? 'focus:border-brand-emerald' : 'focus:border-brand-purple';

  return (
    <div className="flex flex-col h-[500px] bg-slate-950/40 border border-brand-border rounded-2xl p-4 overflow-hidden relative glass-panel">
      {/* Messages Logs Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 mb-4 custom-scrollbar">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={i}
              className={`flex gap-3 text-xs leading-relaxed max-w-[80%] ${
                isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl ${
                  isUser
                    ? `${activeColor} rounded-tr-none`
                    : 'bg-slate-900 border border-brand-border text-slate-200 rounded-tl-none'
                }`}
              >
                {!isUser && (
                  <span className="text-[9px] font-extrabold text-brand-emerald block uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-brand-emerald text-brand-emerald" />
                    {msg.senderName || 'HireIQ Advisor'}
                  </span>
                )}
                <p className="whitespace-pre-wrap select-text leading-relaxed">{msg.content}</p>
                {msg.statusLabel && (
                  <span className="text-[9px] text-slate-500 uppercase font-bold block mt-1.5">
                    {msg.statusLabel}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Streaming Loader bubble */}
        {isLoading && (
          <div className="flex gap-3 text-xs max-w-sm mr-auto text-left">
            <div className="bg-slate-900 border border-brand-border text-slate-200 p-3.5 rounded-2xl rounded-tl-none">
              <span className="text-[9px] font-extrabold text-brand-emerald block uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-brand-emerald text-brand-emerald" />
                Thinking...
              </span>
              <div className="flex space-x-1.5 py-1 justify-start items-center">
                <div className="w-1.5 h-1.5 bg-brand-emerald rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-brand-emerald rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-brand-emerald rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Inputs dispatchers bar */}
      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-brand-border pt-4 bg-slate-950/20">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={disabled || isLoading}
          placeholder={inputPlaceholder}
          className={`flex-1 bg-slate-900 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none ${inputBorderFocus} text-white placeholder-slate-600 disabled:opacity-50 transition-colors`}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || disabled || isLoading}
          className={`${themeColor === 'emerald' ? 'bg-brand-emerald text-brand-dark hover:bg-brand-emerald/90' : 'bg-brand-purple text-white hover:bg-brand-purple/90'} p-3 rounded-xl transition-all shadow disabled:opacity-50 flex items-center justify-center`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
