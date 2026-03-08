import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithAI } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hello! I'm your AI financial assistant. I can help you with:\n\n📊 **Stock analysis** - Technical and fundamental insights\n📈 **Options strategies** - Calls, puts, and risk analysis\n💼 **Portfolio recommendations** - Diversification and optimization\n📰 **Market insights** - News analysis and trends\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "⚠️ I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    { text: "📊 Best tech stocks to invest in?", emoji: "💻" },
    { text: "📖 Explain P/E ratio", emoji: "📚" },
    { text: "🎯 How to diversify my portfolio?", emoji: "🌐" },
    { text: "📞 Calls vs Puts explained", emoji: "🤔" },
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Sparkles className="text-blue-400" />
          AI Financial Assistant
        </h2>
        <p className="text-slate-400">
          💡 Powered by Claude - Ask me anything about stocks, investing, and market analysis
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-br from-purple-600 to-blue-600'
                }`}
              >
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>

              <div
                className={`flex-1 max-w-3xl ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({children}) => <strong className="text-blue-300 font-semibold">{children}</strong>,
                          em: ({children}) => <em className="text-purple-300">{children}</em>,
                          ul: ({children}) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="leading-relaxed">{children}</li>,
                          code: ({children}) => (
                            <code className="bg-slate-700 px-2 py-0.5 rounded text-blue-300 text-sm font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({children}) => (
                            <pre className="bg-slate-700 p-3 rounded-lg overflow-x-auto mb-3">
                              {children}
                            </pre>
                          ),
                          h1: ({children}) => <h1 className="text-xl font-bold mb-2 text-blue-300">{children}</h1>,
                          h2: ({children}) => <h2 className="text-lg font-bold mb-2 text-blue-300">{children}</h2>,
                          h3: ({children}) => <h3 className="text-base font-bold mb-2 text-purple-300">{children}</h3>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-3 text-slate-300">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                  <span>{message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="bg-slate-800 rounded-2xl px-6 py-4">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                  <span className="ml-2 text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="border-t border-slate-800 p-4 bg-slate-850">
            <div className="text-sm text-slate-400 mb-3">💡 Quick questions to get started:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question.text)}
                  className="text-left text-sm bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-3 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">{question.emoji}</span>
                  <span>{question.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-800 p-4 bg-slate-850">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="💬 Ask about stocks, market trends, or investing strategies..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            ⚠️ AI responses are for informational purposes only and should not be considered financial advice.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;