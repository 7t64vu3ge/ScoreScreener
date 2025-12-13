"use client"
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Stock, SortOption, SortField } from '@/lib/types';
import { sortStocks } from '@/lib/screenerLogic';
import { ResultsTable } from '@/components/screener/ResultsTable';
import { StockDetailModal } from '@/components/screener/StockDetailModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function WatchlistPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlistTickers, setWatchlistTickers] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>({ field: 'marketCap', direction: 'desc' });
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
        // router.push('/auth'); // Or just show message as requested
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchData = async () => {
        if (!user) return; // Don't fetch if no user
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://scorescreener-1.onrender.com/api';
            const [stocksRes, watchlistRes] = await Promise.all([
                fetch(`${apiUrl}/stocks`),
                fetch(`${apiUrl}/watchlist`)
            ]);
            
            const stocksData = await stocksRes.json();
            const watchlistData = await watchlistRes.json();

            setStocks(stocksData);
            setWatchlistTickers(watchlistData.map((item: any) => item.ticker));
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setDataLoading(false);
        }
    };
    if (!authLoading && user) {
        fetchData();
    } else if (!authLoading && !user) {
        setDataLoading(false);
    }
  }, [user, authLoading]);

  const watchlistStocks = useMemo(() => {
      return stocks.filter(stock => watchlistTickers.includes(stock.ticker));
  }, [stocks, watchlistTickers]);

  const sortedStocks = useMemo(() => {
    return sortStocks(watchlistStocks, sort);
  }, [watchlistStocks, sort]);

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  if (authLoading || dataLoading) return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-lg animate-pulse">Loading Watchlist...</div>
      </div>
  );

  if (!user) {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="text-muted-foreground">Please sign in to your account to view your watchlist.</p>
              <Link href="/auth">
                  <Button>Sign In</Button>
              </Link>
          </div>
      );
  }

  return (
    <main className="h-screen flex flex-col bg-background text-foreground overflow-hidden font-sans">
      <header className="h-14 border-b flex items-center justify-between px-6 bg-background shrink-0">
         <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
                 <div className="size-8 bg-black text-white flex items-center justify-center font-bold text-lg rounded-none">S</div>
                 <h1 className="text-xl font-bold tracking-tight">ScoreScreener</h1>
            </Link>
         </div>
         <nav className="flex items-center gap-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Link href="/" className="hover:text-foreground transition-colors">Screener</Link>
            <span className="text-foreground">Watchlist</span>
            <Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link>
         </nav>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-secondary/10">
          <h2 className="text-xl font-bold mb-4">Your Watchlist</h2>
          {watchlistStocks.length === 0 ? (
              <p>No stocks in watchlist.</p>
          ) : (
            <ResultsTable 
                stocks={sortedStocks} 
                sort={sort} 
                onSort={handleSort}
                onRowClick={setSelectedStock}
            />
          )}
      </div>

      <StockDetailModal 
        stock={selectedStock} 
        onClose={() => setSelectedStock(null)} 
      />
    </main>
  );
}
