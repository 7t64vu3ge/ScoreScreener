import express from 'express';
import Watchlist from '../models/Watchlist';
import mongoose from 'mongoose';

const router = express.Router();

// In-memory fallback for offline mode
let offlineWatchlist: { ticker: string }[] = [];

router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('Serving offlineWatchlist');
            return res.json(offlineWatchlist);
        }
        const watchlist = await Watchlist.find({});
        res.json(watchlist);
    } catch (error) {
        console.error('Watchlist fetch error', error);
        // Fallback
        res.json(offlineWatchlist);
    }
});

router.post('/', async (req, res) => {
    try {
        const { ticker } = req.body;
        if (!ticker) {
            res.status(400).json({ error: 'Ticker is required' });
            return;
        }

        if (mongoose.connection.readyState !== 1) {
            if (!offlineWatchlist.find(w => w.ticker === ticker)) {
                offlineWatchlist.push({ ticker });
            }
            return res.json({ ticker });
        }

        const exists = await Watchlist.findOne({ ticker });
        if (exists) {
            res.json(exists);
            return;
        }

        const newItem = await Watchlist.create({ ticker });
        res.json(newItem);
    } catch (error) {
        // Fallback
        if (!offlineWatchlist.find(w => w.ticker === req.body.ticker)) {
            offlineWatchlist.push({ ticker: req.body.ticker });
        }
        res.json({ ticker: req.body.ticker });
    }
});

router.delete('/', async (req, res) => {
    try {
        const ticker = req.query.ticker as string;
        if (!ticker) {
            res.status(400).json({ error: 'Ticker is required' });
            return;
        }

        if (mongoose.connection.readyState !== 1) {
            offlineWatchlist = offlineWatchlist.filter(w => w.ticker !== ticker);
            return res.json({ success: true });
        }

        await Watchlist.deleteOne({ ticker });
        res.json({ success: true });
    } catch (error) {
        offlineWatchlist = offlineWatchlist.filter(w => w.ticker !== req.query.ticker);
        res.json({ success: true });
    }
});

export default router;
