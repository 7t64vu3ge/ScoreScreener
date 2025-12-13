"use client"
import React, { useState, useEffect } from 'react';
import { FilterSidebar } from '@/components/screener/FilterSidebar';
import { ResultsTable } from '@/components/screener/ResultsTable';
import { StockDetailModal } from '@/components/screener/StockDetailModal';
import { Stock, FilterCriteria, SortOption } from '@/lib/types';
import { filterStocks, sortStocks } from '@/lib/screenerLogic';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { user, logout } = useAuth();
  
  // Default filter state
  const [filters, setFilters] = useState<FilterCriteria>({
    sector: 'All',
    marketCapMin: 0,
    priceMin: 0,
    dividendYieldMin: 0
  });

  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'marketCap',
    direction: 'desc'
  });

  useEffect(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://scorescreener-1.onrender.com/api';
      fetch(`${apiUrl}/stocks`)
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) {
                setStocks(data);
                setFilteredStocks(data); // Initialize filtered stocks with all data
            }
        })
        .catch(err => console.error("Failed to fetch stocks", err))
        .finally(() => setLoading(false));
  }, []);

  // Filter effect
  useEffect(() => {
      let result = filterStocks(stocks, filters);
      result = sortStocks(result, sortOption);
      setFilteredStocks(result);
  }, [stocks, filters, sortOption]);

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (field: any) => { // Using any to bypass SortField strictness or import SortField
    setSortOption(prev => ({
      field: field as any,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <main className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
             <div className="size-8 bg-black text-white flex items-center justify-center font-bold text-lg rounded-none">S</div>
             <h1 className="text-xl font-bold tracking-tight">ScoreScreener</h1>
        </div>
        <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span className="text-foreground">Screener</span>
          <Link href="/watchlist" className="hover:text-foreground transition-colors">Watchlist</Link>
          {user ? (
              <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground normal-case tracking-normal">Hello, {user.username}</span>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">Profile</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
              </div>
          ) : (
              <Link href="/auth">
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">Sign In</Button>
              </Link>
          )}
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[300px] border-r bg-background/50 overflow-y-auto shrink-0 hidden lg:block">
           <FilterSidebar 
              filters={filters} 
              onFilterChange={setFilters} 
              className="min-h-full border-none shadow-none rounded-none"
           />
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-secondary/10">
            {/* Top Bar inside content for count/meta */}
            <div className="h-12 border-b flex items-center justify-between px-6 bg-background shrink-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Results: <span className="text-foreground">{filteredStocks.length}</span>
                </span>
                <div className="flex items-center gap-2">
                    {/* View toggles could go here */}
                </div>
            </div>

            {/* Main Content */}
        <section className="flex-1 overflow-auto p-6">
           <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Results: {filteredStocks.length}</h2>
           </div>
           
           {loading ? (
               <div className="h-full flex items-center justify-center">
                   <div className="text-muted-foreground animate-pulse">Loading stocks...</div>
               </div>
           ) : (
             <ResultsTable 
               stocks={filteredStocks} 
               onRowClick={setSelectedStock}
               sort={sortOption}
               onSort={handleSortChange}
             />
           )}
        </section>
        </div>
      </div>

      <StockDetailModal 
        stock={selectedStock} 
        onClose={() => setSelectedStock(null)} 
      />
    </main>
  );
}
