import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { fetchNews } from '../services/api';

const News: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState<string | undefined>(undefined);
  const [filterInput, setFilterInput] = useState('');

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', selectedTicker],
    queryFn: () => fetchNews(selectedTicker),
    refetchInterval: 60000,
  });

  const getSentimentBadge = (sentiment: string) => {
    const config = {
      positive: { bg: 'bg-green-900', text: 'text-green-400', icon: TrendingUp },
      negative: { bg: 'bg-red-900', text: 'text-red-400', icon: TrendingDown },
      neutral: { bg: 'bg-slate-800', text: 'text-slate-400', icon: Clock },
    };

    const { bg, text, icon: Icon } = config[sentiment as keyof typeof config] || config.neutral;

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${bg}`}>
        <Icon size={12} className={text} />
        <span className={`text-xs font-semibold ${text}`}>{sentiment}</span>
      </div>
    );
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now.getTime() - time.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Newspaper className="text-blue-400" />
            Market News
          </h2>
          <p className="text-slate-400 mt-2">
            Stay updated with the latest market movements and financial news
          </p>
        </div>
        <div className="flex gap-2">
  <button
    onClick={() => setSelectedTicker(undefined)}
    className={`px-4 py-2 rounded-lg transition-colors ${
      !selectedTicker
        ? 'bg-blue-600 text-white'
        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
    }`}
  >
    All News
  </button>
  <input
    type="text"
    id="tickerFilter"
    placeholder="Filter by ticker..."
    autoComplete="off"
    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  />
  <button
    onClick={() => {
      const input = document.getElementById('tickerFilter') as HTMLInputElement;
      setSelectedTicker(input.value.toUpperCase() || undefined);
    }}
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
  >
    Filter
  </button>
</div>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {news && news.length > 0 ? (
          news.map((article: any) => (
            <div
              key={article.id}
              className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    {getSentimentBadge(article.sentiment)}
                  </div>

                  <p className="text-slate-300 mb-4 line-clamp-2">{article.summary}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{getTimeAgo(article.timestamp)}</span>
                      </div>
                      <div className="font-semibold">{article.source}</div>
                    </div>

                    {article.tickers && article.tickers.length > 0 && (
                      <div className="flex gap-2">
                        {article.tickers.map((ticker: string) => (
                          <span
                            key={ticker}
                            className="px-3 py-1 bg-slate-800 rounded-full text-sm font-semibold text-blue-400 hover:bg-slate-700 transition-colors"
                          >
                            {ticker}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center">
            <Newspaper size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No news available</h3>
            <p className="text-slate-400">Check back later for the latest market updates</p>
          </div>
        )}
      </div>

      {/* AI Summary Section */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-800/50">
        <h3 className="text-lg font-semibold mb-4">AI Market Summary</h3>
        <p className="text-slate-300 leading-relaxed">
          Today's market showed mixed signals with technology stocks leading gains while healthcare
          lagged. Federal Reserve comments on monetary policy continue to influence investor
          sentiment. Earnings season is showing strong results from major corporations, particularly
          in the AI and cloud computing sectors. Traders are closely watching inflation data and
          employment figures for signals about the economic trajectory.
        </p>
      </div>
    </div>
  );
};

export default News;