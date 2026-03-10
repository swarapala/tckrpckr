import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart2 } from 'lucide-react';
import StockChart from './StockChart';
import OptionsAnalysis from './OptionsAnalysis';
import Recommendations from './Recommendations';
import { fetchStockData, fetchStockQuote } from '../services/api';

interface StockAnalysisProps {
  ticker: string;
  onTickerChange: (ticker: string) => void;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({ ticker, onTickerChange }) => {
  const [timeRange, setTimeRange] = useState('1M');
  
  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ['quote', ticker],
    queryFn: () => fetchStockQuote(ticker),
    refetchInterval: 30000,
  });

  const { data: historicalData, isLoading: dataLoading } = useQuery({
    queryKey: ['historical', ticker, timeRange],
    queryFn: () => fetchStockData(ticker, timeRange),
  });

  const timeRanges = ['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y'];
  const isPositive = quote?.change && quote.change > 0;
  const changePercent = quote?.changePercent ? (quote.changePercent * 100).toFixed(2) : '0.00';

  const metrics = [
    { label: 'Market Cap', value: quote?.marketCap ? `$${(quote.marketCap / 1e9).toFixed(2)}B` : 'N/A', icon: DollarSign },
    { label: 'P/E Ratio', value: quote?.pe?.toFixed(2) || 'N/A', icon: BarChart2 },
    { label: '52W High', value: quote?.fiftyTwoWeekHigh ? `$${quote.fiftyTwoWeekHigh.toFixed(2)}` : 'N/A', icon: TrendingUp },
    { label: '52W Low', value: quote?.fiftyTwoWeekLow ? `$${quote.fiftyTwoWeekLow.toFixed(2)}` : 'N/A', icon: TrendingDown },
    { label: 'Avg Volume', value: quote?.avgVolume ? `${(quote.avgVolume / 1e6).toFixed(2)}M` : 'N/A', icon: Activity },
    { label: 'Beta', value: quote?.beta?.toFixed(2) || 'N/A', icon: Activity },
  ];

  if (quoteLoading || dataLoading) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-xl text-white/80">Loading {ticker} data...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching real-time stock information...</p>
      </div>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Stock Header */}
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold">{ticker}</h2>
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/80">
                {quote?.exchange || 'NASDAQ'}
              </span>
            </div>
            <p className="text-white/60 mt-1">{quote?.name || 'Loading...'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${quote?.price?.toFixed(2) || '0.00'}</div>
            <div className={`flex items-center gap-2 justify-end mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{quote?.change?.toFixed(2) || '0.00'} ({isPositive ? '+' : ''}{changePercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <Icon size={16} />
                  <span className="text-xs">{metric.label}</span>
                </div>
                <div className="text-lg font-semibold">{metric.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Price Chart</h3>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <StockChart data={historicalData} ticker={ticker} />
      </div>

      {/* Options Analysis */}
      <OptionsAnalysis ticker={ticker} />

      {/* AI Recommendations */}
      <Recommendations ticker={ticker} />
    </div>
  );
};

export default StockAnalysis;