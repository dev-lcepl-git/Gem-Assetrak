import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Asset, UserRole } from '../types';

interface MaintenanceChatProps {
    assets: Asset[];
    userRole: UserRole;
}

const MaintenanceChat: React.FC<MaintenanceChatProps> = ({ assets, userRole }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hello ${userRole}! I'm your Maintenance Assistant. I have access to the plant's asset inventory and specifications. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        // Format history for API
        const history = messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        // Pass the current assets to the service so it knows about new items
        const responseText = await sendMessageToGemini(userMessage.text, history, assets);

        const botMessage: ChatMessage = {
            role: 'model',
            text: responseText || "I'm sorry, I couldn't process that request.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, {
            role: 'model',
            text: "Error connecting to the AI service.",
            timestamp: new Date()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center gap-2 transition-colors">
        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">AI Maintenance Assistant</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-purple-100 dark:bg-purple-900'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-blue-600 dark:text-blue-300" /> : <Bot className="w-5 h-5 text-purple-600 dark:text-purple-300" />}
              </div>
              <div
                className={`p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
             <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                   <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-300 animate-spin" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg rounded-tl-none text-sm text-slate-500 dark:text-slate-400 italic shadow-sm">
                    Analyzing technical documentation...
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about maintenance, specs, or spare parts..."
            disabled={isLoading}
            className="flex-1 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
            AI can make mistakes. Please verify critical specs with the printed nameplates.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceChat;