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

export interface FilterCriteria {
    search?: string;
    marketCapMin?: number;
    marketCapMax?: number;
    peMin?: number;
    peMax?: number;
    sector?: string;
    priceMin?: number;
    priceMax?: number;
    dividendYieldMin?: number;
    dividendYieldMax?: number;
    high52WeekMin?: number; // Filter by price near high? Or just min/max of high
    high52WeekMax?: number;
}

export type SortField = 'ticker' | 'name' | 'price' | 'changesPercentage' | 'marketCap' | 'pe';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
    field: SortField;
    direction: SortDirection;
}
