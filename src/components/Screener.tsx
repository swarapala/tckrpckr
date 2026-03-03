import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Save, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

interface Stock {
  ticker: string;
  price: number;
  pe?: number;
  marketCap?: number;
  week52Low: number;
  week52High: number;
  beta?: number;
  volume?: number;
  avgVolume?: number;
  // Options data
  callIV?: number;
  putIV?: number;
  callVolume?: number;
  putVolume?: number;
  callOI?: number;
  putOI?: number;
  // Calculated ratios
  highLowRatio: number;
  currentToLow: number;
  currentToHigh: number;
  // Additional
  sector?: string;
  industry?: string;
  dividend?: number;
  revenue?: number;
  earnings?: number;
}

type ColumnKey = keyof Stock;

const Screener: React.FC = () => {
  // Sample data - in production this would come from your backend
  const [stocks] = useState<Stock[]>([
    {
      ticker: 'AAPL',
      price: 255.78,
      pe: 32.36,
      marketCap: 3900000000000,
      week52Low: 169.21,
      week52High: 288.61,
      beta: 1.20,
      volume: 45000000,
      avgVolume: 50000000,
      callIV: 0.28,
      putIV: 0.26,
      callVolume: 125000,
      putVolume: 98000,
      callOI: 450000,
      putOI: 380000,
      highLowRatio: 1.706,
      currentToLow: 1.512,
      currentToHigh: 0.886,
      sector: 'Technology',
      dividend: 0.96,
    },
    {
      ticker: 'MSFT',
      price: 401.32,
      pe: 25.11,
      marketCap: 2980000000000,
      week52Low: 344.79,
      week52High: 555.45,
      beta: 0.95,
      volume: 28000000,
      avgVolume: 25000000,
      callIV: 0.24,
      putIV: 0.23,
      callVolume: 95000,
      putVolume: 82000,
      callOI: 320000,
      putOI: 285000,
      highLowRatio: 1.611,
      currentToLow: 1.164,
      currentToHigh: 0.723,
      sector: 'Technology',
      dividend: 3.00,
    },
    // Add more stocks here...
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<ColumnKey>('ticker');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filters
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPE: '',
    maxPE: '',
    minMarketCap: '',
    sector: '',
  });

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(['ticker', 'price', 'pe', 'week52Low', 'week52High', 'highLowRatio', 'currentToLow', 'currentToHigh'])
  );

  const allColumns: { key: ColumnKey; label: string; category: string }[] = [
    { key: 'ticker', label: 'Ticker', category: 'Basic' },
    { key: 'price', label: 'Price', category: 'Basic' },
    { key: 'pe', label: 'P/E', category: 'Fundamentals' },
    { key: 'marketCap', label: 'Market Cap', category: 'Fundamentals' },
    { key: 'beta', label: 'Beta', category: 'Fundamentals' },
    { key: 'dividend', label: 'Dividend', category: 'Fundamentals' },
    { key: 'week52Low', label: '52W Low', category: 'Technicals' },
    { key: 'week52High', label: '52W High', category: 'Technicals' },
    { key: 'highLowRatio', label: 'High/Low', category: 'Ratios' },
    { key: 'currentToLow', label: 'Current/Low', category: 'Ratios' },
    { key: 'currentToHigh', label: 'Current/High', category: 'Ratios' },
    { key: 'volume', label: 'Volume', category: 'Technicals' },
    { key: 'avgVolume', label: 'Avg Volume', category: 'Technicals' },
    { key: 'callIV', label: 'Call IV', category: 'Options' },
    { key: 'putIV', label: 'Put IV', category: 'Options' },
    { key: 'callVolume', label: 'Call Vol', category: 'Options' },
    { key: 'putVolume', label: 'Put Vol', category: 'Options' },
    { key: 'callOI', label: 'Call OI', category: 'Options' },
    { key: 'putOI', label: 'Put OI', category: 'Options' },
    { key: 'sector', label: 'Sector', category: 'Basic' },
  ];

  const toggleColumn = (column: ColumnKey) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(column)) {
      newVisible.delete(column);
    } else {
      newVisible.add(column);
    }
    setVisibleColumns(newVisible);
  };

  const handleSort = (column: ColumnKey) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedStocks = useMemo(() => {
    let result = stocks.filter(stock => {
      // Search filter
      if (searchTerm && !stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Price filters
      if (filters.minPrice && stock.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && stock.price > parseFloat(filters.maxPrice)) return false;

      // P/E filters
      if (filters.minPE && stock.pe && stock.pe < parseFloat(filters.minPE)) return false;
      if (filters.maxPE && stock.pe && stock.pe > parseFloat(filters.maxPE)) return false;

      // Sector filter
      if (filters.sector && stock.sector !== filters.sector) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return result;
  }, [stocks, searchTerm, filters, sortColumn, sortDirection]);

  const formatValue = (key: ColumnKey, value: any) => {
    if (value === undefined || value === null) return 'N/A';
    
    switch (key) {
      case 'price':
      case 'week52Low':
      case 'week52High':
      case 'dividend':
        return `$${value.toFixed(2)}`;
      case 'marketCap':
        return `$${(value / 1e9).toFixed(2)}B`;
      case 'volume':
      case 'avgVolume':
      case 'callVolume':
      case 'putVolume':
      case 'callOI':
      case 'putOI':
        return (value / 1e6).toFixed(2) + 'M';
      case 'callIV':
      case 'putIV':
        return `${(value * 100).toFixed(1)}%`;
      case 'highLowRatio':
      case 'currentToLow':
      case 'currentToHigh':
      case 'pe':
      case 'beta':
        return value.toFixed(2);
      default:
        return value;
    }
  };

  const exportToCSV = () => {
    const headers = Array.from(visibleColumns).join(',');
    const rows = filteredAndSortedStocks.map(stock => 
      Array.from(visibleColumns).map(col => stock[col]).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screener-results.csv';
    a.click();
  };

  const [showColumnPicker, setShowColumnPicker] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Advanced Stock Screener</h2>
          <p className="text-slate-400 mt-2">
            {filteredAndSortedStocks.length} stocks | Customize columns, filters, and export data
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowColumnPicker(!showColumnPicker)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Eye size={18} />
            Columns
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Column Picker */}
      {showColumnPicker && (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Customize Columns</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(
              allColumns.reduce((acc, col) => {
                if (!acc[col.category]) acc[col.category] = [];
                acc[col.category].push(col);
                return acc;
              }, {} as Record<string, typeof allColumns>)
            ).map(([category, cols]) => (
              <div key={category}>
                <div className="text-sm font-semibold text-slate-400 mb-2">{category}</div>
                <div className="space-y-2">
                  {cols.map(col => (
                    <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded"
                      />
                      <span className="text-sm">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-blue-400" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ticker..."
                
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              placeholder="$0"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              placeholder="$1000"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Min P/E</label>
            <input
              type="number"
              value={filters.minPE}
              onChange={(e) => setFilters({...filters, minPE: e.target.value})}
              placeholder="0"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Max P/E</label>
            <input
              type="number"
              value={filters.maxPE}
              onChange={(e) => setFilters({...filters, maxPE: e.target.value})}
              placeholder="100"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Energy">Energy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                {Array.from(visibleColumns).map(column => {
                  const colDef = allColumns.find(c => c.key === column);
                  return (
                    <th
                      key={column}
                      onClick={() => handleSort(column)}
                      className="text-left px-4 py-3 text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {colDef?.label}
                        {sortColumn === column && (
                          sortDirection === 'asc' ? <TrendingUp size={14} /> : <TrendingDown size={14} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStocks.map((stock, idx) => (
                <tr
                  key={stock.ticker}
                  className={`border-t border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer ${
                    idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-850'
                  }`}
                >
                  {Array.from(visibleColumns).map(column => (
                    <td key={column} className="px-4 py-3 text-sm">
  {column === 'ticker' ? (
    <span className="font-semibold text-blue-400">{stock[column]}</span>
  ) : (
    <span className={
      // Color coding for ratios
      column === 'currentToHigh' && stock[column]! < 0.7 ? 'text-red-400 font-semibold' :
      column === 'currentToHigh' && stock[column]! < 0.85 ? 'text-yellow-400' :
      column === 'currentToHigh' && stock[column]! > 0.95 ? 'text-green-400 font-semibold' :
      column === 'currentToLow' && stock[column]! > 2.0 ? 'text-green-400 font-semibold' :
      column === 'currentToLow' && stock[column]! > 1.5 ? 'text-green-300' :
      column === 'currentToLow' && stock[column]! < 1.2 ? 'text-red-400 font-semibold' :
      column === 'highLowRatio' && stock[column]! > 2.5 ? 'text-yellow-400' :
      ''
    }>
      {formatValue(column, stock[column])}
    </span>
  )}
</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-800/50">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-lg font-semibold">AI Screening Insights</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Top Opportunities</h4>
            <div className="space-y-2">
              {filteredAndSortedStocks
                .filter(s => s.currentToLow > 1.5 && s.currentToHigh < 0.9)
                .slice(0, 3)
                .map(stock => (
                  <div key={stock.ticker} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-blue-400">{stock.ticker}</span>
                      <span className="text-green-400 text-sm">Strong momentum</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Trading at {((stock.currentToLow - 1) * 100).toFixed(0)}% above 52W low with room to grow. 
                      Current/High ratio of {stock.currentToHigh.toFixed(2)} suggests upside potential.
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">Watch List</h4>
            <div className="space-y-2">
              {filteredAndSortedStocks
                .filter(s => s.currentToHigh > 0.9 && s.currentToLow < 1.3)
                .slice(0, 3)
                .map(stock => (
                  <div key={stock.ticker} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-yellow-400">{stock.ticker}</span>
                      <span className="text-yellow-400 text-sm">Near highs</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Trading near 52W high ({(stock.currentToHigh * 100).toFixed(0)}% of high). 
                      Monitor for breakout or pullback opportunities.
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-2">Risk Alerts</h4>
            <div className="space-y-2">
              {filteredAndSortedStocks
                .filter(s => s.currentToHigh < 0.7)
                .slice(0, 3)
                .map(stock => (
                  <div key={stock.ticker} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-red-400">{stock.ticker}</span>
                      <span className="text-red-400 text-sm">Down significantly</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Trading {((1 - stock.currentToHigh) * 100).toFixed(0)}% below 52W high. 
                      Investigate reason for decline before considering entry.
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screener;
