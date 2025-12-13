import express from 'express';
import Stock from '../models/Stock';

const router = express.Router();

import { getRealTimeStocks } from '../services/alphaVantage';

router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.find({});

        // Enhance with real-time data
        // Note: getRealTimeStocks is rate-limited to 5 stocks internally
        const tickers = stocks.map(s => s.ticker);
        const realTimeData = await getRealTimeStocks(tickers);

        const enhancedStocks = stocks.map(stock => {
            const rt = realTimeData[stock.ticker];
            if (rt) {
                // Determine trend based on change
                const trend = rt.change >= 0 ? 'up' : 'down';

                return {
                    ...stock.toObject(),
                    price: rt.price,
                    change: rt.change,
                    changePercent: rt.changePercent,
                    volume: rt.volume || stock.volume, // Use live volume if available
                    trend: trend
                };
            }
            return stock;
        });

        res.json(enhancedStocks);
    } catch (error) {
        console.error('Error fetching stocks:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
