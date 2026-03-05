import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_APP_API_URL || 'http://localhost:3001/api';

export const fetchStockQuote = async (ticker: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quote/${ticker}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return {
      symbol: ticker,
      name: `${ticker} Inc.`,
      price: 150.25,
      change: 2.5,
      changePercent: 0.0169,
      marketCap: 2500000000000,
      pe: 28.5,
      fiftyTwoWeekHigh: 180.0,
      fiftyTwoWeekLow: 120.0,
      avgVolume: 50000000,
      beta: 1.2,
      exchange: 'NASDAQ',
    };
  }
};

export const fetchStockData = async (ticker: string, timeRange: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/historical/${ticker}`, {
      params: { range: timeRange },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return generateMockHistoricalData(timeRange);
  }
};

export const fetchOptionsChain = async (ticker: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/options/${ticker}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching options:', error);
    return {
      calls: generateMockOptions('call'),
      puts: generateMockOptions('put'),
    };
  }
};

export const getRecommendations = async (ticker: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations/${ticker}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return generateMockRecommendations(ticker);
  }
};

export const fetchNews = async (ticker?: string) => {
  try {
    const url = ticker 
      ? `${API_BASE_URL}/news/${ticker}`
      : `${API_BASE_URL}/news`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return generateMockNews();
  }
};

export const chatWithAI = async (message: string, context?: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      message,
      context,
    });
    return response.data;
  } catch (error) {
    console.error('Error chatting with AI:', error);
    return {
      response: "I'm having trouble connecting right now. Please try again later.",
    };
  }
};

const generateMockHistoricalData = (timeRange: string) => {
  const days = timeRange === '1D' ? 1 : timeRange === '5D' ? 5 : timeRange === '1M' ? 30 : 90;
  const data = [];
  const basePrice = 150;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = Math.random() * 5 - 2.5;
    const close = basePrice + volatility + (Math.random() * 10 - 5);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: close + (Math.random() * 2 - 1),
      high: close + Math.abs(Math.random() * 3),
      low: close - Math.abs(Math.random() * 3),
      close,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
  }

  return data;
};

const generateMockOptions = (type: 'call' | 'put') => {
  const options = [];
  const strikes = [140, 145, 150, 155, 160, 165, 170];
  const expirations = [7, 14, 30, 60, 90];

  strikes.forEach(strike => {
    expirations.forEach(days => {
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + days);
      
      options.push({
        strike,
        expiration: expiration.toISOString().split('T')[0],
        daysToExpiration: days,
        lastPrice: Math.random() * 10 + 1,
        bid: Math.random() * 9 + 0.5,
        ask: Math.random() * 10 + 1,
        volume: Math.floor(Math.random() * 1000),
        openInterest: Math.floor(Math.random() * 5000),
        impliedVolatility: Math.random() * 0.5 + 0.2,
        inTheMoney: type === 'call' ? strike < 150 : strike > 150,
      });
    });
  });

  return options;
};

const generateMockRecommendations = (ticker: string) => {
  return {
    similar: [
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 380.50,
        change: 2.3,
        changePercent: 0.61,
        rating: 'Buy',
        similarity: 0.85,
        reason: 'Similar tech sector, comparable market cap',
      },
    ],
    diversification: [
      {
        sector: 'Healthcare',
        reason: 'Low correlation with tech sector',
        suggestions: ['JNJ', 'UNH', 'PFE'],
        recommendedWeight: 15,
      },
    ],
    insights: [
      {
        title: 'Strong Technical Setup',
        description: 'Price above 50-day MA with increasing volume',
        confidence: 0.75,
      },
    ],
  };
};

const generateMockNews = () => {
  return [
    {
      id: 1,
      title: 'Market Rallies on Fed Comments',
      summary: 'Federal Reserve signals potential pause in rate hikes',
      source: 'Financial Times',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      sentiment: 'positive',
    },
  ];
};

export default {
  fetchStockQuote,
  fetchStockData,
  fetchOptionsChain,
  getRecommendations,
  fetchNews,
  chatWithAI,
};
