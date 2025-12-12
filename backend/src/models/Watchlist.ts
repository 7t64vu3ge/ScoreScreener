import mongoose, { Schema, Model } from 'mongoose';

const WatchlistSchema = new Schema({
    ticker: { type: String, required: true, unique: true },
    addedAt: { type: Date, default: Date.now }
});

const Watchlist: Model<any> = mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema);

export default Watchlist;
