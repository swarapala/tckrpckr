import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { fetchStockQuote } from '../services/api';
import { fetchStockQuote } from '../services/api';

interface Position {
  id: string;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
}

const Portfolio: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPosition, setNewPosition] = useState({
    ticker: '',
    shares: '',
    avgCost: '',
  });
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);


  const [positions, setPositions] = useState<Position[]>([
    { id: '1', ticker: 'AAPL', shares: 50, avgCost: 150.00, currentPrice: 175.50 },
    { id: '2', ticker: 'MSFT', shares: 30, avgCost: 350.00, currentPrice: 380.25 },
    { id: '3', ticker: 'GOOGL', shares: 20, avgCost: 135.00, currentPrice: 142.30 },
  ]);
// Fetch real-time prices on mount only
useEffect(() => {
  const updatePrices = async () => {
    const updatedPositions = await Promise.all(
      positions.map(async (position) => {
        try {
          const quote = await fetchStockQuote(position.ticker);
          return {
            ...position,
            currentPrice: quote.price,
          };
        } catch (error) {
          console.error(`Error fetching price for ${position.ticker}:`, error);
          return position;
        }
      })
    );
    setPositions(updatedPositions);
  };

  if (positions.length > 0) {
    updatePrices();
    const interval = setInterval(updatePrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }
}, []); // Empty dependency - only run on mount

// Fetch price for newly added positions
useEffect(() => {
  const fetchNewPrices = async () => {
    const positionsNeedingUpdate = positions.filter(p => p.currentPrice === p.avgCost);
    
    if (positionsNeedingUpdate.length > 0) {
      const updated = await Promise.all(
        positionsNeedingUpdate.map(async (position) => {
          try {
            const quote = await fetchStockQuote(position.ticker);
            return {
              ...position,
              currentPrice: quote.price,
            };
          } catch (error) {
            console.error(`Error fetching price for ${position.ticker}:`, error);
            return position;
          }
        })
      );

      setPositions(prev => prev.map(p => {
        const updatedPos = updated.find(u => u.id === p.id);
        return updatedPos || p;
      }));
    }
  };

  fetchNewPrices();
}, [positions.length]); // Run when positions are added/removed

  const calculateMetrics = (position: Position) => {
    const totalCost = position.shares * position.avgCost;
    const currentValue = position.shares * position.currentPrice;
    const gainLoss = currentValue - totalCost;
    const gainLossPercent = (gainLoss / totalCost) * 100;

    return {
      totalCost,
      currentValue,
      gainLoss,
      gainLossPercent,
    };
  };

  const portfolioValue = positions.reduce((sum, pos) => {
    return sum + (pos.shares * pos.currentPrice);
  }, 0);

  const totalCost = positions.reduce((sum, pos) => {
    return sum + (pos.shares * pos.avgCost);
  }, 0);

  const totalGainLoss = portfolioValue - totalCost;
  const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

  const deletePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Total Value</div>
          <div className="text-3xl font-bold">${portfolioValue.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Total Cost</div>
          <div className="text-3xl font-bold">${totalCost.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Gain/Loss</div>
          <div className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Return</div>
          <div className={`text-3xl font-bold flex items-center gap-2 ${totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLossPercent >= 0 ? <TrendingUp /> : <TrendingDown />}
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Your Positions</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Position
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Ticker</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Shares</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Avg Cost</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Current Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Total Cost</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Current Value</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Gain/Loss</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Return %</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => {
                const metrics = calculateMetrics(position);
                return (
                  <tr key={position.id} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-400">{position.ticker}</span>
                    </td>
                    <td className="text-right py-3 px-4">{position.shares}</td>
                    <td className="text-right py-3 px-4">${position.avgCost.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">${position.currentPrice.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">${metrics.totalCost.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">${metrics.currentValue.toFixed(2)}</td>
                    <td className={`text-right py-3 px-4 font-semibold ${metrics.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.gainLoss >= 0 ? '+' : ''}${metrics.gainLoss.toFixed(2)}
                    </td>
                    <td className={`text-right py-3 px-4 font-semibold ${metrics.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.gainLossPercent >= 0 ? '+' : ''}{metrics.gainLossPercent.toFixed(2)}%
                    </td>
                    <td className="text-right py-3 px-4">
  <div className="flex gap-2 justify-end">
    <button
      onClick={() => setEditingPosition(position)}
      className="text-blue-400 hover:text-blue-300 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
    <button
      onClick={() => deletePosition(position.id)}
      className="text-red-400 hover:text-red-300 transition-colors"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Position Modal */}
      {/* Add/Edit Position Modal */}
{(showAddModal || editingPosition) && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-800">
      <h3 className="text-xl font-bold mb-4">
        {editingPosition ? 'Edit Position' : 'Add New Position'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Ticker Symbol</label>
          <input
            type="text"
            value={editingPosition ? editingPosition.ticker : newPosition.ticker}
            onChange={(e) => editingPosition 
              ? setEditingPosition({...editingPosition, ticker: e.target.value.toUpperCase()})
              : setNewPosition({...newPosition, ticker: e.target.value.toUpperCase()})
            }
            placeholder="AAPL"
            disabled={!!editingPosition}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Number of Shares</label>
          <input
            type="number"
            value={editingPosition ? editingPosition.shares : newPosition.shares}
            onChange={(e) => editingPosition
              ? setEditingPosition({...editingPosition, shares: parseFloat(e.target.value) || 0})
              : setNewPosition({...newPosition, shares: e.target.value})
            }
            placeholder="10"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Average Cost Per Share</label>
          <input
            type="number"
            value={editingPosition ? editingPosition.avgCost : newPosition.avgCost}
            onChange={(e) => editingPosition
              ? setEditingPosition({...editingPosition, avgCost: parseFloat(e.target.value) || 0})
              : setNewPosition({...newPosition, avgCost: e.target.value})
            }
            placeholder="150.00"
            step="0.01"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => {
              if (editingPosition) {
                // Update existing position
                setPositions(positions.map(p => 
                  p.id === editingPosition.id ? editingPosition : p
                ));
                setEditingPosition(null);
              } else {
                // Add new position
                if (newPosition.ticker && newPosition.shares && newPosition.avgCost) {
                  setPositions([
                    ...positions,
                    {
                      id: Date.now().toString(),
                      ticker: newPosition.ticker,
                      shares: parseFloat(newPosition.shares),
                      avgCost: parseFloat(newPosition.avgCost),
                      currentPrice: parseFloat(newPosition.avgCost),
                    }
                  ]);
                  setNewPosition({ ticker: '', shares: '', avgCost: '' });
                  setShowAddModal(false);
                }
              }
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
          >
            {editingPosition ? 'Save Changes' : 'Add Position'}
          </button>
          <button
            onClick={() => {
              setShowAddModal(false);
              setEditingPosition(null);
              setNewPosition({ ticker: '', shares: '', avgCost: '' });
            }}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition-colors"
          >
            Cancel
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