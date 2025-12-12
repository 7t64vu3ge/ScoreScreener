import mongoose, { Schema, Model } from 'mongoose';

const StockSchema = new Schema({
    ticker: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: Number,
    change: Number,
    changesPercentage: Number,
    marketCap: Number,
    pe: Number,
    sector: String,
    industry: String,
    beta: Number,
    description: String,
    priceHistory: [{
        date: String,
        close: Number
    }],
    dividendYield: Number,
    high52Week: Number,
    low52Week: Number
});

const Stock: Model<any> = mongoose.models.Stock || mongoose.model('Stock', StockSchema);

export default Stock;
