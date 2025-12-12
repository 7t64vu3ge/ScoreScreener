import { Stock, FilterCriteria, SortOption } from './types';

export function filterStocks(stocks: Stock[], criteria: FilterCriteria): Stock[] {
    return stocks.filter((stock) => {
        // Search (Name or Ticker)
        if (criteria.search) {
            const query = criteria.search.toLowerCase();
            const matchesTicker = stock.ticker.toLowerCase().includes(query);
            const matchesName = stock.name.toLowerCase().includes(query);
            if (!matchesTicker && !matchesName) return false;
        }

        // Market Cap Range
        if (criteria.marketCapMin !== undefined && stock.marketCap < criteria.marketCapMin) return false;
        if (criteria.marketCapMax !== undefined && stock.marketCap > criteria.marketCapMax) return false;

        // P/E Range
        // Note: If P/E is null and we are filtering for P/E, we should probably exclude it or handle it.
        // Here we exclude if it doesn't meet the range.
        if (stock.pe === null) {
            // If any P/E filter is active, exclude null P/E stocks? Or include?
            // Usually exclude if looking for valuation.
            if (criteria.peMin !== undefined || criteria.peMax !== undefined) return false;
        } else {
            if (criteria.peMin !== undefined && stock.pe < criteria.peMin) return false;
            if (criteria.peMax !== undefined && stock.pe > criteria.peMax) return false;
        }

        // Sector
        if (criteria.sector && criteria.sector !== 'All') {
            if (stock.sector !== criteria.sector) return false;
        }

        // Price Range
        if (criteria.priceMin !== undefined && stock.price < criteria.priceMin) return false;
        if (criteria.priceMax !== undefined && stock.price > criteria.priceMax) return false;

        // Dividend Yield Range
        if (criteria.dividendYieldMin !== undefined && stock.dividendYield < criteria.dividendYieldMin) return false;
        if (criteria.dividendYieldMax !== undefined && stock.dividendYield > criteria.dividendYieldMax) return false;

        // 52-Week High Range (Filtering stocks with a 52-week high within this range)
        if (criteria.high52WeekMin !== undefined && stock.high52Week < criteria.high52WeekMin) return false;
        if (criteria.high52WeekMax !== undefined && stock.high52Week > criteria.high52WeekMax) return false;

        return true;
    });
}

export function sortStocks(stocks: Stock[], sort: SortOption): Stock[] {
    return [...stocks].sort((a, b) => {
        let valA = a[sort.field];
        let valB = b[sort.field];

        // Handle nulls safely (pushed to bottom usually)
        if (valA === null) valA = -Infinity;
        if (valB === null) valB = -Infinity;

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
    });
}
