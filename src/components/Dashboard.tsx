import React, { useState, useEffect } from 'react';
import Settings from './Settings';
import { TrendingUp, BarChart3, BookOpen, MessageSquare, Settings as SettingsIcon, Search, Bell, Filter, Star } from 'lucide-react';
import MarketOverview from './MarketOverview';
import News from './News';
import ChatBot from './ChatBot';
import Screener from './Screener';
import StockAnalysis from './StockAnalysis';
import Portfolio from './Portfolio';
import { useAuth } from '../contexts/AuthContext';
import Watchlist from './Watchlist';


type View = 'market' | 'analysis' | 'portfolio' | 'news' | 'chat' | 'screener' | 'watchlist' | 'settings';
const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('market');
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { signOut, user } = useAuth();
  const navigationItems = [
    { id: 'market' as View, label: 'Market', icon: TrendingUp },
    { id: 'analysis' as View, label: 'Analysis', icon: BarChart3 },
    { id: 'portfolio' as View, label: 'Portfolio', icon: BookOpen },
    { id: 'news' as View, label: 'News', icon: BookOpen },
    { id: 'chat' as View, label: 'AI Assistant', icon: MessageSquare },
    { id: 'screener' as View, label: 'Screener', icon: Filter },
    { id: 'watchlist' as View, label: 'Watchlist', icon: Star },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
          break;
        case '1':
          setCurrentView('market');
          break;
        case '2':
          setCurrentView('analysis');
          break;
        case '3':
          setCurrentView('portfolio');
          break;
        case '4':
          setCurrentView('news');
          break;
        case '5':
          setCurrentView('chat');
          break;
        case '6':
          setCurrentView('screener');
          break;
        case 's':
          setCurrentView('settings');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
<div className="flex h-screen" style={{ background: 'linear-gradient(135deg, #021008 0%, #000000 50%, #021008 100%)' }}>      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/5 p-3 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
  className={`
    fixed lg:relative inset-y-0 left-0 z-40
    w-64 border-r border-white/10 flex flex-col
    transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `}
  style={{ background: '#021008' }}
>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">
            <span className="text-green-400">tckr</span>
            <span className="text-red-400">pckr</span>
          </h1>
          <p className="text-xs text-white/60 mt-1">AI-Powered Stock Analysis</p>
        </div>
        
        <nav className="flex-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false); // Close sidebar on mobile when item clicked
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
  currentView === item.id
    ? 'bg-black text-white border border-white/30'
    : 'text-white/60 hover:bg-black/50 hover:text-white/90'
}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

       <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setCurrentView('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors"
          >
            <SettingsIcon size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
<header className="h-16 border-b border-white/10 flex items-center justify-between px-6" style={{ background: '#021008' }}>
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <Search className="text-white/60" size={20} />
            <input
              type="text"
              placeholder="Search stocks, ETFs, or ask a question..."
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              onKeyPress={(e) => {
  if (e.key === 'Enter') {
    const value = e.currentTarget.value.toUpperCase().trim();
    if (value) {
      if (value.length > 5) {
        alert('⚠️ Ticker symbols are usually 1-5 characters (e.g., AAPL, MSFT)');
        return;
      }
      setSelectedTicker(value);
      setCurrentView('analysis');
      e.currentTarget.value = ''; // Clear search box
    }
  }
}}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Bell size={20} className="text-white/60" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
  <div className="w-8 h-8 rounded-full bg-white/20"></div>
  <div className="text-sm">
    <div className="font-medium">{user?.user_metadata?.full_name || 'User'}</div>
    <div className="text-xs text-white/60">{user?.email}</div>
  </div>
  <button
    onClick={signOut}
    className="ml-2 px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
  >
    Logout
  </button>
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
          {currentView === 'watchlist' && <Watchlist />}
          {currentView === 'settings' && <Settings />}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-white/10 bg-black px-6 py-4">
          <div className="flex items-center justify-between text-sm text-white/60">
            <div className="flex items-center gap-4">
              <span>© 2026 <span className="text-green-400">tckr</span><span className="text-red-400">pckr</span></span>              
              <span className="text-white/40">•</span>
              <span>v1.0.0 Beta</span>
              <span className="text-white/40">•</span>
              <span className="text-white/40 text-xs">Press "/" to search, 1-6 for navigation</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white/90 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/90 transition-colors">Privacy</a>
              <a href="https://github.com/swarapala/tckrpckr" target="_blank" rel="noopener noreferrer" className="hover:text-white/90 transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
