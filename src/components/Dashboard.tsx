import React, { useState } from 'react';
import { TrendingUp, BarChart3, BookOpen, MessageSquare, Settings, Search, Bell, Filter } from 'lucide-react';
import MarketOverview from './MarketOverview';
import StockAnalysis from './StockAnalysis';
import Portfolio from './Portfolio';
import News from './News';
import ChatBot from './ChatBot';
import Screener from './Screener';

type View = 'market' | 'analysis' | 'portfolio' | 'news' | 'chat' | 'screener';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('market');
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');

  const navigationItems = [
    { id: 'market' as View, label: 'Market', icon: TrendingUp },
    { id: 'analysis' as View, label: 'Analysis', icon: BarChart3 },
    { id: 'portfolio' as View, label: 'Portfolio', icon: BookOpen },
    { id: 'news' as View, label: 'News', icon: BookOpen },
    { id: 'chat' as View, label: 'AI Assistant', icon: MessageSquare },
    { id: 'screener' as View, label: 'Screener', icon: Filter },
  ];

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400">TickPickV1</h1>
          <p className="text-xs text-slate-400 mt-1">Professional Market Analysis</p>
        </div>
        
        <nav className="flex-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search stocks, ETFs, or ask a question..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.toUpperCase();
                  if (value) {
                    setSelectedTicker(value);
                    setCurrentView('analysis');
                  }
                }
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell size={20} className="text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="text-sm">
                <div className="font-medium">Pro User</div>
                <div className="text-xs text-slate-400">Free Trial</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {currentView === 'market' && <MarketOverview />}
          {currentView === 'analysis' && (
            <StockAnalysis 
              ticker={selectedTicker} 
              onTickerChange={setSelectedTicker}
            />
          )}
          {currentView === 'portfolio' && <Portfolio />}
          {currentView === 'news' && <News />}
          {currentView === 'chat' && <ChatBot />}
          {currentView === 'screener' && <Screener />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;