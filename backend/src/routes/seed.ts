import express from 'express';
import Stock from '../models/Stock';

// Paste the large MOCK_STOCKS array or import it. For cleanliness, I'll paste the essential structure and a few items, 
// OR I should copy the mockData file to backend and use it.
import { MOCK_STOCKS } from '../data/mockData';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        await Stock.deleteMany({}); // Clear existing
        await Stock.insertMany(MOCK_STOCKS); // Insert mock data
        res.json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Failed to seed database' });
    }
});

export default router;
