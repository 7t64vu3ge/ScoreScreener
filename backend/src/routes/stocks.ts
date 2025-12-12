import express from 'express';
import Stock from '../models/Stock';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.find({});
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stocks:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
