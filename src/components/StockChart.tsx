import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

interface StockChartProps {
  data: ChartDataPoint[] | undefined;
  ticker: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, ticker }) => {
  const [showBollinger, setShowBollinger] = useState(true);
  const [showSMA, setShowSMA] = useState(true);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const calculateSMA = (period: number) => {
      return data.map((point, idx) => {
        if (idx < period - 1) return null;
        const sum = data.slice(idx - period + 1, idx + 1).reduce((acc, p) => acc + p.close, 0);
        return sum / period;
      });
    };

    const calculateBollingerBands = (period = 20, stdDev = 2) => {
      const sma = calculateSMA(period);
      return data.map((point, idx) => {
        if (idx < period - 1) return { upper: null, middle: null, lower: null };
        
        const slice = data.slice(idx - period + 1, idx + 1);
        const mean = sma[idx];
        if (mean === null) return { upper: null, middle: null, lower: null };
        
        const variance = slice.reduce((acc, p) => acc + Math.pow(p.close - mean, 2), 0) / period;
        const std = Math.sqrt(variance);
        
        return {
          upper: mean + stdDev * std,
          middle: mean,
          lower: mean - stdDev * std,
        };
      });
    };

    const sma20 = calculateSMA(20);
    const sma50 = calculateSMA(50);
    const bollinger = calculateBollingerBands(20, 2);

    return data.map((point, idx) => ({
      ...point,
      sma20: sma20[idx],
      sma50: sma50[idx],
      bollingerUpper: bollinger[idx].upper,
      bollingerMiddle: bollinger[idx].middle,
      bollingerLower: bollinger[idx].lower,
      displayDate: new Date(point.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl">
        <p className="text-sm text-slate-400 mb-2">{data.displayDate}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Close:</span>
            <span className="font-semibold">${data.close.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">High:</span>
            <span className="text-green-400">${data.high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Low:</span>
            <span className="text-red-400">${data.low.toFixed(2)}</span>
          </div>
          {showSMA && data.sma20 && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">SMA20:</span>
              <span className="text-blue-400">${data.sma20.toFixed(2)}</span>
            </div>
          )}
          {showSMA && data.sma50 && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">SMA50:</span>
              <span className="text-purple-400">${data.sma50.toFixed(2)}</span>
            </div>
          )}
          {showBollinger && data.bollingerUpper && (
            <>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">BB Upper:</span>
                <span className="text-orange-400">${data.bollingerUpper.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">BB Lower:</span>
                <span className="text-cyan-400">${data.bollingerLower.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        No chart data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showBollinger}
            onChange={(e) => setShowBollinger(e.target.checked)}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800"
          />
          Bollinger Bands
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showSMA}
            onChange={(e) => setShowSMA(e.target.checked)}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800"
          />
          Moving Averages
        </label>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="displayDate"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {showBollinger && (
            <>
              <Line
                type="monotone"
                dataKey="bollingerUpper"
                stroke="#fb923c"
                strokeWidth={1}
                dot={false}
                name="BB Upper"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="bollingerLower"
                stroke="#22d3ee"
                strokeWidth={1}
                dot={false}
                name="BB Lower"
                strokeDasharray="5 5"
              />
            </>
          )}

          {showSMA && (
            <>
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="SMA 20"
              />
              <Line
                type="monotone"
                dataKey="sma50"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
                name="SMA 50"
              />
            </>
          )}

          <Line
            type="monotone"
            dataKey="close"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            name="Close Price"
          />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="displayDate"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1e6).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
            }}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
            name="Volume"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;