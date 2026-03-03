import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MarketOverview: React.FC = () => {
  const indices = [
    { name: 'S&P 500', symbol: 'SPY', price: 4783.35, change: 23.45, changePercent: 0.49 },
    { name: 'Dow Jones', symbol: 'DIA', price: 37305.16, change: -45.22, changePercent: -0.12 },
    { name: 'Nasdaq', symbol: 'QQQ', price: 16685.97, change: 156.37, changePercent: 0.95 },
    { name: 'Russell 2000', symbol: 'IWM', price: 2027.07, change: 8.12, changePercent: 0.40 },
  ];

  const topMovers = {
    gainers: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 45.32, changePercent: 5.46 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 187.45, change: 8.92, changePercent: 5.00 },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 238.45, change: 9.87, changePercent: 4.32 },
    ],
    losers: [
      { symbol: 'COIN', name: 'Coinbase Global', price: 145.23, change: -12.45, changePercent: -7.90 },
      { symbol: 'RIVN', name: 'Rivian Automotive', price: 18.34, change: -1.23, changePercent: -6.28 },
      { symbol: 'LCID', name: 'Lucid Group', price: 3.45, change: -0.18, changePercent: -4.96 },
    ],
  };

  const sectorPerformance = [
    { name: 'Technology', change: 1.2, color: 'bg-green-500' },
    { name: 'Healthcare', change: 0.8, color: 'bg-green-400' },
    { name: 'Financials', change: 0.5, color: 'bg-green-300' },
    { name: 'Consumer Discretionary', change: -0.3, color: 'bg-red-300' },
    { name: 'Energy', change: -0.7, color: 'bg-red-400' },
    { name: 'Utilities', change: -1.1, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Major Indices */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Major Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index) => (
            <div
              key={index.symbol}
              className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-400">{index.name}</div>
                <span className="px-2 py-1 bg-slate-800 rounded text-xs font-semibold">
                  {index.symbol}
                </span>
              </div>
              <div className="text-2xl font-bold mb-2">{index.price.toLocaleString()}</div>
              <div
                className={`flex items-center gap-2 ${
                  index.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {index.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="font-semibold">
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)} ({index.change >= 0 ? '+' : ''}
                  {index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gainers */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-400" />
            Top Gainers
          </h3>
          <div className="space-y-3">
            {topMovers.gainers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
              >
                <div>
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-sm text-slate-400">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${stock.price.toFixed(2)}</div>
                  <div className="text-sm text-green-400 font-semibold">
                    +{stock.change.toFixed(2)} (+{stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="text-red-400" />
            Top Losers
          </h3>
          <div className="space-y-3">
            {topMovers.losers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
              >
                <div>
                  <div className="font-semibold">{stock.symbol}</div>
                  <div className="text-sm text-slate-400">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${stock.price.toFixed(2)}</div>
                  <div className="text-sm text-red-400 font-semibold">
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Performance */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-blue-400" />
          Sector Performance
        </h3>
        <div className="space-y-4">
          {sectorPerformance.map((sector) => (
            <div key={sector.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{sector.name}</span>
                <span
                  className={`text-sm font-semibold ${
                    sector.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {sector.change >= 0 ? '+' : ''}
                  {sector.change.toFixed(2)}%
                </span>
              </div>
              <div className="relative w-full bg-slate-800 rounded-full h-2">
                <div
                  className={`absolute h-2 rounded-full ${sector.color} transition-all duration-500`}
                  style={{
                    width: `${Math.abs(sector.change) * 10}%`,
                    left: sector.change >= 0 ? '50%' : `${50 - Math.abs(sector.change) * 10}%`,
                  }}
                ></div>
                <div className="absolute left-1/2 top-0 w-px h-2 bg-slate-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Market Breadth</div>
          <div className="text-2xl font-bold mb-1">52% Bullish</div>
          <div className="text-sm text-green-400">1,456 advancing, 1,342 declining</div>
        </div>
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="text-sm text-slate-400 mb-2">VIX (Fear Index)</div>
          <div className="text-2xl font-bold mb-1">14.23</div>
          <div className="text-sm text-green-400">-0.45 (-3.07%)</div>
        </div>
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Put/Call Ratio</div>
          <div className="text-2xl font-bold mb-1">0.87</div>
          <div className="text-sm text-slate-400">Neutral sentiment</div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;