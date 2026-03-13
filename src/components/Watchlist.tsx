import React, { useState, useEffect } from 'react';
import { Star, Plus, X, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import {
  getDefaultWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  Watchlist as WatchlistType,
} from '../services/watchlist';
import { fetchStockQuote } from '../services/api';

interface StockData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistType | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicker, setNewTicker] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    const data = await getDefaultWatchlist();
    setWatchlist(data);

    if (data && data.tickers.length > 0) {
      await loadStockPrices(data.tickers);
    }

    setLoading(false);
  };

  const loadStockPrices = async (tickers: string[]) => {
    const promises = tickers.map(async (ticker) => {
      try {
        const quote = await fetchStockQuote(ticker);
        return {
          ticker,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent * 100,
        };
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error);
        return {
          ticker,
          price: 0,
          change: 0,
          changePercent: 0,
        };
      }
    });

    const data = await Promise.all(promises);
    setStockData(data);
  };

  const handleAddTicker = async () => {
    if (!watchlist || !newTicker.trim()) return;

    const success = await addToWatchlist(watchlist.id, newTicker.trim());
    
    if (success) {
      await loadWatchlist();
      setNewTicker('');
      setShowAddModal(false);
    }
  };

  const handleRemoveTicker = async (ticker: string) => {
    if (!watchlist) return;

    const success = await removeFromWatchlist(watchlist.id, ticker);
    
    if (success) {
      await loadWatchlist();
    }
  };

  const handleRefresh = async () => {
    if (!watchlist) return;
    
    setRefreshing(true);
    await loadStockPrices(watchlist.tickers);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-white/80">Loading watchlist...</p>
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
            <Star className="text-yellow-400" fill="currentColor" />
            My Watchlist
          </h2>
          <p className="text-white/60 mt-2">Track your favorite stocks in real-time</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Stock
          </button>
        </div>
      </div>

      {/* Watchlist Grid */}
      {watchlist && watchlist.tickers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockData.map((stock) => (
            <div
              key={stock.ticker}
              className="bg-black rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{stock.ticker}</h3>
                  <p className="text-3xl font-bold mt-2">${stock.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRemoveTicker(stock.ticker)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <X size={16} className="text-red-400" />
                </button>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stock.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="font-semibold">
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black rounded-xl p-12 border border-white/10 text-center">
          <Star size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
          <p className="text-white/60 mb-6">Add stocks to track your favorites</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add Your First Stock
          </button>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Add to Watchlist</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTicker('');
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ticker Symbol</label>
                <input
                  type="text"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTicker();
                    }
                  }}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-600 uppercase"
                  placeholder="AAPL"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTicker('');
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTicker}
                  disabled={!newTicker.trim()}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-white/10 disabled:cursor-not-allowed py-2 rounded-lg transition-colors"
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;