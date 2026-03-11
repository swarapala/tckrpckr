import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2, Edit2, X } from 'lucide-react';
import { fetchStockQuote } from '../services/api';
import {
  getDefaultPortfolio,
  getPositions,
  addPosition as addPositionDB,
  updatePosition as updatePositionDB,
  deletePosition as deletePositionDB,
  Position,
} from '../services/portfolio';

const Portfolio: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  // Form state
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [avgCost, setAvgCost] = useState('');

  // Load portfolio and positions
  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    const portfolio = await getDefaultPortfolio();
    
    if (portfolio) {
      setPortfolioId(portfolio.id);
      const loadedPositions = await getPositions(portfolio.id);
      setPositions(loadedPositions);
      
      // Fetch current prices
      for (const position of loadedPositions) {
        try {
          const quote = await fetchStockQuote(position.ticker);
          setPositions(prev =>
            prev.map(p =>
              p.ticker === position.ticker ? { ...p, currentPrice: quote.price } : p
            )
          );
        } catch (error) {
          console.error(`Error fetching price for ${position.ticker}:`, error);
        }
      }
    }
    
    setLoading(false);
  };

  // Close modal on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setEditingPosition(null);
      }
    };

    if (showAddModal || editingPosition) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [showAddModal, editingPosition]);

  const handleAddPosition = async () => {
    if (!portfolioId) return;
    
    const newPosition = await addPositionDB(
      portfolioId,
      ticker,
      parseFloat(shares),
      parseFloat(avgCost)
    );

    if (newPosition) {
      // Fetch current price
      try {
        const quote = await fetchStockQuote(ticker);
        newPosition.currentPrice = quote.price;
      } catch (error) {
        console.error('Error fetching price:', error);
      }

      setPositions([...positions, newPosition]);
      setShowAddModal(false);
      setTicker('');
      setShares('');
      setAvgCost('');
    }
  };

  const handleEditPosition = async () => {
    if (!editingPosition?.id) return;

    const success = await updatePositionDB(
      editingPosition.id,
      parseFloat(shares),
      parseFloat(avgCost)
    );

    if (success) {
      setPositions(
        positions.map((p) =>
          p.id === editingPosition.id
            ? { ...p, shares: parseFloat(shares), avgCost: parseFloat(avgCost) }
            : p
        )
      );
      setEditingPosition(null);
      setTicker('');
      setShares('');
      setAvgCost('');
    }
  };

  const handleDeletePosition = async (id: string) => {
    const success = await deletePositionDB(id);
    
    if (success) {
      setPositions(positions.filter((p) => p.id !== id));
    }
  };

  const openEditModal = (position: Position) => {
    setEditingPosition(position);
    setTicker(position.ticker);
    setShares(position.shares.toString());
    setAvgCost(position.avgCost.toString());
  };

  const totalValue = positions.reduce(
    (sum, p) => sum + (p.currentPrice || p.avgCost) * p.shares,
    0
  );
  const totalCost = positions.reduce((sum, p) => sum + p.avgCost * p.shares, 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-white/80">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Portfolio</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Position
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Total Value</div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Total Cost</div>
            <div className="text-2xl font-bold">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-white/60 mb-1">Total Gain/Loss</div>
            <div className={`text-2xl font-bold flex items-center gap-2 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              ${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Positions Table */}
        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-white/60 border-b border-white/10">
                  <th className="pb-3">Ticker</th>
                  <th className="pb-3">Shares</th>
                  <th className="pb-3">Avg Cost</th>
                  <th className="pb-3">Current Price</th>
                  <th className="pb-3">Total Value</th>
                  <th className="pb-3">Gain/Loss</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const currentPrice = position.currentPrice || position.avgCost;
                  const value = currentPrice * position.shares;
                  const cost = position.avgCost * position.shares;
                  const gainLoss = value - cost;
                  const gainLossPercent = cost > 0 ? (gainLoss / cost) * 100 : 0;

                  return (
                    <tr key={position.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 font-semibold">{position.ticker}</td>
                      <td className="py-4">{position.shares}</td>
                      <td className="py-4">${position.avgCost.toFixed(2)}</td>
                      <td className="py-4">${currentPrice.toFixed(2)}</td>
                      <td className="py-4">${value.toFixed(2)}</td>
                      <td className={`py-4 font-semibold ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${Math.abs(gainLoss).toFixed(2)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(position)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-white/60" />
                          </button>
                          <button
                            onClick={() => handleDeletePosition(position.id!)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No positions yet</h3>
            <p className="text-white/60 mb-6">Start building your portfolio by adding your first position</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Your First Position
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingPosition) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingPosition ? 'Edit Position' : 'Add Position'}</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPosition(null);
                  setTicker('');
                  setShares('');
                  setAvgCost('');
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
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  disabled={!!editingPosition}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600 disabled:opacity-50 uppercase"
                  placeholder="AAPL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600"
                  placeholder="100"
                  step="0.0001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Average Cost per Share</label>
                <input
                  type="number"
                  value={avgCost}
                  onChange={(e) => setAvgCost(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-600"
                  placeholder="150.00"
                  step="0.01"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPosition(null);
                    setTicker('');
                    setShares('');
                    setAvgCost('');
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPosition ? handleEditPosition : handleAddPosition}
                  disabled={!ticker || !shares || !avgCost}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-white/10 disabled:cursor-not-allowed py-2 rounded-lg transition-colors"
                >
                  {editingPosition ? 'Update' : 'Add'} Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;