const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;
require('dotenv').config();

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cache for reducing API calls
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Routes

// Get stock quote
app.get('/api/quote/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const cacheKey = `quote-${ticker}`;
    
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const quote = await yahooFinance.quote(ticker);
    
    const data = {
      symbol: quote.symbol,
      name: quote.longName || quote.shortName,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent / 100,
      marketCap: quote.marketCap,
      pe: quote.trailingPE,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      avgVolume: quote.averageDailyVolume3Month,
      beta: quote.beta,
      exchange: quote.exchange,
    };

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Get historical data
app.get('/api/historical/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { range = '1M' } = req.query;
    
    const cacheKey = `historical-${ticker}-${range}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rangeMap = {
      '1D': { period1: new Date(Date.now() - 24 * 60 * 60 * 1000), period2: new Date(), interval: '5m' },
      '5D': { period1: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), period2: new Date(), interval: '15m' },
      '1M': { period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), period2: new Date(), interval: '1d' },
      '3M': { period1: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), period2: new Date(), interval: '1d' },
      '6M': { period1: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), period2: new Date(), interval: '1d' },
      'YTD': { period1: new Date(new Date().getFullYear(), 0, 1), period2: new Date(), interval: '1d' },
      '1Y': { period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), period2: new Date(), interval: '1d' },
      '5Y': { period1: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000), period2: new Date(), interval: '1wk' },
    };

    const queryOptions = rangeMap[range] || rangeMap['1M'];
    const history = await yahooFinance.historical(ticker, queryOptions);

    const data = history.map(item => ({
      date: item.date.toISOString().split('T')[0],
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Get options chain
app.get('/api/options/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const cacheKey = `options-${ticker}`;
    
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const options = await yahooFinance.options(ticker);
    
    if (!options || !options.options || options.options.length === 0) {
      return res.json({ calls: [], puts: [] });
    }

    const firstExpiration = options.options[0];
    
    const data = {
      calls: firstExpiration.calls.map(opt => ({
        strike: opt.strike,
        expiration: new Date(opt.expiration * 1000).toISOString().split('T')[0],
        daysToExpiration: Math.ceil((opt.expiration * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
        lastPrice: opt.lastPrice,
        bid: opt.bid,
        ask: opt.ask,
        volume: opt.volume,
        openInterest: opt.openInterest,
        impliedVolatility: opt.impliedVolatility,
        inTheMoney: opt.inTheMoney,
      })),
      puts: firstExpiration.puts.map(opt => ({
        strike: opt.strike,
        expiration: new Date(opt.expiration * 1000).toISOString().split('T')[0],
        daysToExpiration: Math.ceil((opt.expiration * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
        lastPrice: opt.lastPrice,
        bid: opt.bid,
        ask: opt.ask,
        volume: opt.volume,
        openInterest: opt.openInterest,
        impliedVolatility: opt.impliedVolatility,
        inTheMoney: opt.inTheMoney,
      })),
    };

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ error: 'Failed to fetch options chain' });
  }
});

// Get recommendations (AI-powered)
app.get('/api/recommendations/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // Mock data for now
    const data = {
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

    res.json(data);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get news
// Get news (all)
app.get('/api/news', async (req, res) => {
  try {
    const mockNews = [
      {
        id: 1,
        title: 'Market Rallies on Fed Comments',
        summary: 'Federal Reserve signals potential pause in rate hikes',
        source: 'Financial Times',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive',
      },
      {
        id: 2,
        title: 'Tech Earnings Beat Expectations',
        summary: 'Major technology companies report strong quarterly results',
        source: 'Bloomberg',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        sentiment: 'positive',
      },
    ];

    res.json(mockNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get news by ticker
app.get('/api/news/:ticker', async (req, res) => {
  try {
    const mockNews = [
      {
        id: 1,
        title: 'Market Rallies on Fed Comments',
        summary: 'Federal Reserve signals potential pause in rate hikes',
        source: 'Financial Times',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive',
      },
    ];

    res.json(mockNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        response: "AI features require a Claude API key. Please add ANTHROPIC_API_KEY to your .env file.",
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: "You are a professional financial analyst assistant. Provide accurate, helpful information about stocks, markets, and investing. Always include appropriate disclaimers about investment risks.",
      messages: [
        {
          role: "user",
          content: message,
        }
      ],
    });

    res.json({
      response: response.content[0].text,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});