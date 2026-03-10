import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, Target, Shield } from 'lucide-react';
import { getRecommendations } from '../services/api';

interface RecommendationsProps {
  ticker: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ ticker }) => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', ticker],
    queryFn: () => getRecommendations(ticker),
  });

  if (isLoading) {
    return (
      <div className="bg-black rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="text-blue-400" />
          AI-Powered Recommendations
        </h3>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'strong buy':
        return 'text-green-400 bg-green-900';
      case 'buy':
        return 'text-green-300 bg-green-900';
      case 'hold':
        return 'text-yellow-400 bg-yellow-900';
      case 'sell':
        return 'text-red-300 bg-red-900';
      case 'strong sell':
        return 'text-red-400 bg-red-900';
      default:
        return 'text-white/60 bg-white/5';
    }
  };

  return (
    <div className="bg-black rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Sparkles className="text-blue-400" />
        AI-Powered Recommendations
      </h3>

      {/* Similar Stocks */}
      {recommendations?.similar && recommendations.similar.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target size={18} className="text-purple-400" />
            Similar Stocks You May Like
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.similar.map((stock: any) => (
              <div
                key={stock.symbol}
                className="bg-white/5 rounded-lg p-4 hover:bg-slate-750 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-lg">{stock.symbol}</div>
                    <div className="text-sm text-white/60">{stock.name}</div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${getRatingColor(
                      stock.rating
                    )}`}
                  >
                    {stock.rating}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                  <div>
                    <div className="text-white/60 text-xs">Price</div>
                    <div className="font-semibold">${stock.price?.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Change</div>
                    <div
                      className={`font-semibold ${
                        stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stock.change >= 0 ? '+' : ''}
                      {stock.changePercent?.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Similarity</div>
                    <div className="font-semibold text-blue-400">
                      {(stock.similarity * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/60">
                  {stock.reason || 'Similar sector and market metrics'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diversification Suggestions */}
      {recommendations?.diversification && recommendations.diversification.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield size={18} className="text-green-400" />
            Diversification Opportunities
          </h4>
          <div className="space-y-3">
            {recommendations.diversification.map((suggestion: any, idx: number) => (
              <div
                key={idx}
                className="bg-white/5 rounded-lg p-4 flex items-start gap-4"
              >
                <div className="flex-1">
                  <div className="font-semibold mb-1">{suggestion.sector}</div>
                  <div className="text-sm text-white/60 mb-2">{suggestion.reason}</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.suggestions?.map((stock: string) => (
                      <span
                        key={stock}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-slate-600 transition-colors cursor-pointer"
                      >
                        {stock}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Weight</div>
                  <div className="text-lg font-semibold text-blue-400">
                    {suggestion.recommendedWeight}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategy Insights */}
      {recommendations?.insights && (
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-800/50">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            AI Investment Insights
          </h4>
          <div className="space-y-4">
            {recommendations.insights.map((insight: any, idx: number) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{insight.title}</div>
                  <div className="text-sm text-white/80">{insight.description}</div>
                  {insight.confidence && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${insight.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white/60">
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/50">
        <p className="text-sm text-white/80">
          <strong>Note:</strong> These recommendations are generated by AI based on historical data,
          market trends, and portfolio analysis. Always conduct your own research and consult with a
          financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default Recommendations;