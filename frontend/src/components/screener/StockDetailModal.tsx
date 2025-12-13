"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Stock } from '@/lib/types';
import { X, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StockDetailModalProps {
  stock: Stock | null;
  onClose: () => void;
}

export function StockDetailModal({ stock, onClose }: StockDetailModalProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://scorescreener-1.onrender.com/api';

  useEffect(() => {
    if (stock) {
      fetch(`${apiUrl}/watchlist`)
        .then(res => res.json())
        .then((data: any[]) => {
           if(Array.isArray(data)) {
               setInWatchlist(data.some(w => w.ticker === stock?.ticker));
           }
        })
        .catch(err => console.error("Error checking watchlist", err));
    }
  }, [stock]);

  const { user } = useAuth();

  const toggleWatchlist = async () => {
      if (!stock) return;
      
      if (!user) {
          alert("Please sign in to your account to manage your watchlist.");
          return;
      }

      setLoading(true);
      try {
        if (inWatchlist) {
            await fetch(`${apiUrl}/watchlist?ticker=${stock.ticker}`, { method: 'DELETE' });
            setInWatchlist(false);
        } else {
            await fetch(`${apiUrl}/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker: stock.ticker })
            });
            setInWatchlist(true);
        }
      } catch (e) {
        console.error("Failed to toggle watchlist", e);
      } finally {
        setLoading(false);
      }
  };

  // We keep the return null if not stock for safety, or we can let Dialog handle it
  // But typically standard controlled dialog is best.
  // Actually, if stock is null, we can't render details.
  
  return (
    <Dialog open={!!stock} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        {stock && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b shrink-0">
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  {stock.name} <span className="text-muted-foreground text-lg font-normal">({stock.ticker})</span>
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xl font-bold">${stock.price.toFixed(2)}</span>
                  <Badge variant={stock.changesPercentage >= 0 ? 'success' : 'warning'}>
                     {stock.changesPercentage > 0 ? '+' : ''}{stock.changesPercentage.toFixed(2)}%
                  </Badge>
                  <span className="text-muted-foreground text-sm">{stock.sector} | {stock.industry}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                    variant={inWatchlist ? "default" : "outline"} 
                    size="sm" 
                    onClick={toggleWatchlist} 
                    disabled={loading}
                    className={inWatchlist ? "bg-black text-white" : ""}
                >
                    {inWatchlist ? <Check className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                    {inWatchlist ? 'Watchlisted' : 'Add to Watchlist'}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Chart */}
              <div className="h-[300px] w-full mb-6">
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Price History (30 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stock.priceHistory}>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                        contentStyle={{ borderRadius: '0px', border: '1px solid hsl(var(--border))', boxShadow: 'none' }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="close" 
                        stroke={stock.changesPercentage >= 0 ? '#22c55e' : '#ef4444'} 
                        strokeWidth={2} 
                        dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border bg-muted/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Market Cap</div>
                    <div className="font-semibold font-mono">
                        {(stock.marketCap / 1e9).toFixed(2)}B
                    </div>
                </div>
                <div className="p-4 border bg-muted/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">P/E Ratio</div>
                    <div className="font-semibold font-mono">
                        {stock.pe ? stock.pe.toFixed(2) : '-'}
                    </div>
                </div>
                <div className="p-4 border bg-muted/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Beta</div>
                    <div className="font-semibold font-mono">
                        {stock.beta}
                    </div>
                </div>
                <div className="p-4 border bg-muted/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Div Yield</div>
                    <div className="font-semibold font-mono">
                        {stock.dividendYield ? stock.dividendYield.toFixed(2) + '%' : '-'}
                    </div>
                </div>
                <div className="p-4 border bg-muted/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">52-W Range</div>
                    <div className="font-semibold text-xs font-mono">
                        {stock.low52Week?.toFixed(2)} - {stock.high52Week?.toFixed(2)}
                    </div>
                </div>
                <div className="p-4 border bg-muted/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Change $</div>
                    <div className="font-semibold font-mono">
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                    </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-widest">About</h3>
                <p className="text-sm leading-relaxed text-foreground/80 font-normal">
                    {stock.description}
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
