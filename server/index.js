const express = require('express');
const cors = require('cors');
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

// In-memory cache
const cache = new Map();
const CACHE_DURATION = 60000; // 60 seconds

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stock quote endpoint
app.get('/api/quote/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // Return mock data
    res.json({
      symbol: ticker,
      name: `${ticker} Inc.`,
      price: Math.random() * 200 + 100,
      change: Math.random() * 10 - 5,
      changePercent: (Math.random() * 0.1 - 0.05),
      marketCap: Math.random() * 3000000000000,
      pe: Math.random() * 40 + 10,
      fiftyTwoWeekHigh: Math.random() * 300 + 150,
      fiftyTwoWeekLow: Math.random() * 150 + 50,
      avgVolume: Math.floor(Math.random() * 100000000),
      beta: Math.random() * 2,
      exchange: 'NASDAQ',
    });
  } catch (error) {
    console.error('Error in quote endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Historical data endpoint
app.get('/api/historical/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { range = '1M' } = req.query;
    
    const days = range === '1D' ? 1 : range === '5D' ? 5 : range === '1M' ? 30 : 90;
    const data = [];
    const basePrice = 150;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const close = basePrice + (Math.random() * 20 - 10);
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: close + (Math.random() * 2 - 1),
        high: close + Math.abs(Math.random() * 3),
        low: close - Math.abs(Math.random() * 3),
        close,
        volume: Math.floor(Math.random() * 50000000) + 10000000,
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in historical endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Options chain endpoint
app.get('/api/options/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    
    const strikes = [140, 145, 150, 155, 160, 165, 170];
    const calls = [];
    const puts = [];

    strikes.forEach(strike => {
      calls.push({
        strike,
        lastPrice: Math.random() * 10 + 1,
        bid: Math.random() * 9,
        ask: Math.random() * 10 + 1,
        volume: Math.floor(Math.random() * 1000),
        openInterest: Math.floor(Math.random() * 5000),
        impliedVolatility: Math.random() * 0.5 + 0.2,
        expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        daysToExpiration: 30,
      });

      puts.push({
        strike,
        lastPrice: Math.random() * 10 + 1,
        bid: Math.random() * 9,
        ask: Math.random() * 10 + 1,
        volume: Math.floor(Math.random() * 1000),
        openInterest: Math.floor(Math.random() * 5000),
        impliedVolatility: Math.random() * 0.5 + 0.2,
        expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        daysToExpiration: 30,
      });
    });

    res.json({ calls, puts });
  } catch (error) {
    console.error('Error in options endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch options' });
  }
});

// Recommendations endpoint
app.get('/api/recommendations/:ticker', async (req, res) => {
  try {
    res.json({
      similar: [
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          price: 380.50,
          change: 2.3,
          changePercent: 0.61,
          rating: 'Buy',
          similarity: 0.85,
        },
      ],
      diversification: [
        {
          sector: 'Healthcare',
          reason: 'Low correlation with tech',
          suggestions: ['JNJ', 'UNH'],
          recommendedWeight: 15,
        },
      ],
      insights: [
        {
          title: 'Strong Technical Setup',
          description: 'Price above 50-day MA',
          confidence: 0.75,
        },
      ],
    });
  } catch (error) {
    console.error('Error in recommendations endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// News endpoint
app.get('/api/news/:ticker?', async (req, res) => {
  try {
    res.json([
      {
        id: 1,
        title: 'Market Rallies on Fed Comments',
        summary: 'Federal Reserve signals potential pause',
        source: 'Financial Times',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive',
        tickers: ['SPY', 'QQQ'],
      },
    ]);
  } catch (error) {
    console.error('Error in news endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        response: "AI features require a Claude API key.",
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});