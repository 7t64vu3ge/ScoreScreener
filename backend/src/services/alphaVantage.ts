import axios from 'axios';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Rate limit handling: Free tier 5 calls / minute
// We will only fetch a few stocks to demonstrate functionality
const MAX_STOCKS_TO_FETCH = 5;

interface AlphaVantageQuote {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
}

interface StockData {
    price: number;
    change: number;
    changePercent: number;
    volume?: number;
}

// Function to fetch data for a single stock
const fetchStockQuote = async (ticker: string): Promise<StockData | null> => {
    try {
        const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
        const response = await axios.get(url);

        if (response.data["Note"]) {
            console.warn(`Alpha Vantage Rate Limit Hit for ${ticker}: ${response.data["Note"]}`);
            return null;
        }

        const quote: AlphaVantageQuote = response.data["Global Quote"];

        if (!quote || !quote['05. price']) {
            return null;
        }

        return {
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume'])
        };

    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null;
    }
};

// Function to update multiple stocks
// We will simply return a map of ticker -> data
export const getRealTimeStocks = async (tickers: string[]) => {
    const results: Record<string, StockData> = {};

    // Slice to avoid rate limit immediately on large lists
    const targets = tickers.slice(0, MAX_STOCKS_TO_FETCH);

    console.log(`Fetching real-time data for ${targets.length} stocks (Alpha Vantage Limit 5/min)...`);

    for (const ticker of targets) {
        const data = await fetchStockQuote(ticker);
        if (data) {
            results[ticker] = data;
        }
        // Small delay to be nice?
    }

    return results;
};
