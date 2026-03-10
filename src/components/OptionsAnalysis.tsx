import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchOptionsChain } from '../services/api';

interface OptionsAnalysisProps {
  ticker: string;
}

const OptionsAnalysis: React.FC<OptionsAnalysisProps> = ({ ticker }) => {
  const [optionType, setOptionType] = useState<'calls' | 'puts'>('calls');
  
  const { data: optionsData, isLoading } = useQuery({
    queryKey: ['options', ticker],
    queryFn: () => fetchOptionsChain(ticker),
  });

  const analyzeSweetSpots = (options: any[]) => {
    if (!options || options.length === 0) return [];

    return options
      .map((option) => {
        const bidAskSpread = option.ask - option.bid;
        const spreadPercentage = (bidAskSpread / option.ask) * 100;
        const impliedVolatility = option.impliedVolatility || 0;
        const openInterest = option.openInterest || 0;
        const volume = option.volume || 0;

        let score = 0;

        if (spreadPercentage < 2) score += 30;
        else if (spreadPercentage < 5) score += 20;
        else if (spreadPercentage < 10) score += 10;

        if (openInterest > 1000 && volume > 100) score += 30;
        else if (openInterest > 500 && volume > 50) score += 20;
        else if (openInterest > 100) score += 10;

        if (impliedVolatility > 0.2 && impliedVolatility < 0.6) score += 20;
        else if (impliedVolatility > 0.15 && impliedVolatility < 0.8) score += 10;

        const daysToExpiry = option.daysToExpiration || 0;
        if (daysToExpiry >= 30 && daysToExpiry <= 60) score += 20;
        else if (daysToExpiry >= 20 && daysToExpiry <= 90) score += 10;

        return {
          ...option,
          score,
          spreadPercentage,
          recommendation: score >= 70 ? 'excellent' : score >= 50 ? 'good' : score >= 30 ? 'fair' : 'poor',
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  if (isLoading) {
    return (
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">Options Analysis</h3>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const currentOptions = optionType === 'calls' ? optionsData?.calls : optionsData?.puts;
  const sweetSpots = analyzeSweetSpots(currentOptions || []);

  const getRecommendationBadge = (recommendation: string) => {
    const config = {
      excellent: { bg: 'bg-green-900', text: 'text-green-400', icon: CheckCircle },
      good: { bg: 'bg-blue-900', text: 'text-white/80', icon: CheckCircle },
      fair: { bg: 'bg-yellow-900', text: 'text-yellow-400', icon: AlertCircle },
      poor: { bg: 'bg-red-900', text: 'text-red-400', icon: AlertCircle },
    };

    const { bg, text, icon: Icon } = config[recommendation as keyof typeof config] || config.poor;

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bg}`}>
        <Icon size={14} className={text} />
        <span className={`text-xs font-semibold uppercase ${text}`}>{recommendation}</span>
      </div>
    );
  };

  return (
    <div className="bg-black rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Options Sweet Spots</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setOptionType('calls')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              optionType === 'calls'
                ? 'bg-emerald-700 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <TrendingUp size={16} />
            Calls
          </button>
          <button
            onClick={() => setOptionType('puts')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              optionType === 'puts'
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <TrendingDown size={16} />
            Puts
          </button>
        </div>
      </div>

      {sweetSpots.length === 0 ? (
        <div className="text-center text-white/60 py-12">
          No options data available for {ticker}
        </div>
      ) : (
        <div className="space-y-4">
          {sweetSpots.map((option, idx) => (
            <div
              key={`${option.strike}-${option.expiration}`}
              className="bg-white/5 rounded-lg p-5 hover:bg-slate-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-white/80">
                    ${option.strike}
                  </div>
                  {getRecommendationBadge(option.recommendation)}
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-green-400">
                    ${option.lastPrice?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="text-sm text-white/60">Premium</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-white/60">Expiration</div>
                  <div className="font-medium mt-1">
                    {new Date(option.expiration).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {option.daysToExpiration} days
                  </div>
                </div>

                <div>
                  <div className="text-white/60">Volume / OI</div>
                  <div className="font-medium mt-1">
                    {option.volume || 0} / {option.openInterest || 0}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {option.openInterest > 500 ? 'High liquidity' : 'Low liquidity'}
                  </div>
                </div>

                <div>
                  <div className="text-white/60">Implied Vol</div>
                  <div className="font-medium mt-1">
                    {((option.impliedVolatility || 0) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {option.impliedVolatility < 0.3 ? 'Low' : option.impliedVolatility < 0.6 ? 'Moderate' : 'High'}
                  </div>
                </div>

                <div>
                  <div className="text-white/60">Bid-Ask Spread</div>
                  <div className="font-medium mt-1">
                    ${option.bid?.toFixed(2)} - ${option.ask?.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {option.spreadPercentage?.toFixed(2)}% spread
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/15">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        option.score >= 70
                          ? 'bg-emerald-600'
                          : option.score >= 50
                          ? 'bg-blue-500'
                          : option.score >= 30
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${option.score}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{option.score}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/15">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <AlertCircle size={16} className="text-white/80" />
          Analysis Criteria
        </h4>
        <ul className="text-xs text-white/60 space-y-1">
          <li>• Tight bid-ask spreads (&lt;5% preferred)</li>
          <li>• High liquidity (volume &gt;100, open interest &gt;1000)</li>
          <li>• Moderate implied volatility (20-60% range)</li>
          <li>• Optimal time to expiration (30-60 days)</li>
        </ul>
      </div>
    </div>
  );
};

export default OptionsAnalysis;