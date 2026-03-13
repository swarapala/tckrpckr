import React, { useState, useEffect } from 'react';
import { Newspaper, Clock, ExternalLink } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  source: string;
  url: string;
  image: string;
  publishedAt: number;
  summary: string;
}

const News: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: 'General', value: 'general' },
    { label: 'Forex', value: 'forex' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'Merger', value: 'merger' },
  ];

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const apiUrl = (import.meta as any).env.VITE_APP_API_URL;
      const baseUrl = apiUrl.replace('/api', '');
      const response = await fetch(`${baseUrl}/api/news?category=${selectedCategory}`);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now.getTime() - time.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60) {
      return `${diffInMins}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-white/80">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Newspaper className="text-white/80" />
            Market News
          </h2>
          <p className="text-white/60 mt-2">
            Stay updated with the latest financial news from Finnhub
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === cat.value
                ? 'bg-emerald-700 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <button
          onClick={loadNews}
          className="ml-auto px-4 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            
              <a key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-black rounded-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden group"
            >
              <div className="flex gap-4 p-6">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <ExternalLink size={16} className="text-white/40 flex-shrink-0 mt-1" />
                  </div>
                  
                  <p className="text-sm text-white/60 mb-3 line-clamp-2">{article.summary}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="font-semibold text-white/60">{article.source}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{getTimeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="bg-black rounded-xl p-12 border border-white/10 text-center">
            <Newspaper size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No news available</h3>
            <p className="text-white/60">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;