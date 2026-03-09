import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

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

  const [positions, setPositions] = useState<Position[]>([
    { id: '1', ticker: 'AAPL', shares: 50, avgCost: 150.00, currentPrice: 175.50 },
    { id: '2', ticker: 'MSFT', shares: 30, avgCost: 350.00, currentPrice: 380.25 },
    { id: '3', ticker: 'GOOGL', shares: 20, avgCost: 135.00, currentPrice: 142.30 },
  ]);

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
                      <button
                        onClick={() => deletePosition(position.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-800">
            <h3 className="text-xl font-bold mb-4">Add New Position</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ticker Symbol</label>
                <input
                  type="text"
                  value={newPosition.ticker}
                  onChange={(e) => setNewPosition({...newPosition, ticker: e.target.value.toUpperCase()})}
                  placeholder="AAPL"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of Shares</label>
                <input
                  type="number"
                  value={newPosition.shares}
                  onChange={(e) => setNewPosition({...newPosition, shares: e.target.value})}
                  placeholder="10"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Average Cost Per Share</label>
                <input
                  type="number"
                  value={newPosition.avgCost}
                  onChange={(e) => setNewPosition({...newPosition, avgCost: e.target.value})}
                  placeholder="150.00"
                  step="0.01"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
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
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
                >
                  Add Position
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
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