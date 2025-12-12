export interface Stock {
    ticker: string;
    name: string;
    price: number;
    change: number;
    changesPercentage: number;
    marketCap: number; // in simple number, e.g. 30000000000
    pe: number | null;
    sector: string;
    industry: string;
    beta: number;
    description: string;
    priceHistory: { date: string; close: number }[]; // Minimal history for sparklines
    dividendYield: number; // Percentage, e.g. 1.5
    high52Week: number;
    low52Week: number;
}
