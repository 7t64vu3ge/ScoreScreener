import express from 'express';
import Stock from '../models/Stock';
import axios from 'axios';

const router = express.Router();
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// List of stocks to seed from API
const TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

router.get('/', async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({ error: 'ALPHA_VANTAGE_API_KEY not configured' });
        }

        await Stock.deleteMany({}); // Clear existing data

        const seededStocks = [];

        console.log('Starting API Seed via Alpha Vantage...');

        for (const ticker of TICKERS) {
            console.log(`Fetching Overview for ${ticker}...`);
            try {
                // Fetch Company Overview (Name, Sector, MarketCap, etc.)
                const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`;
                const response = await axios.get(overviewUrl);

                const data = response.data;

                if (data.Symbol) {
                    // Create stock object
                    const newStock = {
                        ticker: data.Symbol,
                        name: data.Name,
                        sector: data.Sector || 'Technology',
                        price: 0, // Will be updated by live quote or set to 0 initially
                        change: 0,
                        changePercent: 0,
                        marketCap: parseInt(data.MarketCapitalization) || 0,
                        volume: 0,
                        peRatio: parseFloat(data.PERatio) || 0,
                        dividendYield: parseFloat(data.DividendYield) || 0,
                        description: data.Description,
                        beta: parseFloat(data.Beta) || 0,
                        // Generate a simple sparkline placeholder or leave empty
                        sparkline: [100, 102, 101, 104, 103, 105]
                    };

                    await Stock.create(newStock);
                    seededStocks.push(newStock);
                } else {
                    console.warn(`No data found for ${ticker}`, data);
                }

                // Rate Limit: Free tier is 5 calls/minute. 
                // We must wait at least 15 seconds between calls to be safe if strictly 5/min, 
                // or just wait 12s. 60s / 5 = 12s.
                await sleep(15000);

            } catch (err) {
                console.error(`Failed to fetch ${ticker}`, err);
            }
        }

        res.json({
            success: true,
            message: `Database seeded with ${seededStocks.length} stocks from Alpha Vantage`,
            data: seededStocks
        });

    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Failed to seed database' });
    }
});

export default router;
