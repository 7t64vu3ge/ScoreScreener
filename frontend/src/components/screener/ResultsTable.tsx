"use client"
import React from 'react';
import { Stock, SortOption, SortField } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsTableProps {
  stocks: Stock[];
  sort: SortOption;
  onSort: (field: SortField) => void;
  onRowClick: (stock: Stock) => void;
}

export function ResultsTable({ stocks, sort, onSort, onRowClick }: ResultsTableProps) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const formatMarketCap = (val: number) => {
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    return val.toString();
  };

  const renderSortIcon = (field: SortField) => {
    if (sort.field !== field) return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sort.direction === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : <ArrowDown className="ml-2 h-3 w-3" />;
  };

  const thClass = "h-8 px-4 text-left align-middle font-medium text-xs uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors group border-r border-border/50";
  const tdClass = "p-4 align-middle text-sm border-r border-border/50 last:border-r-0";

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table className="relative w-full caption-bottom text-left border-collapse">
          <TableHeader className="bg-muted/10 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className={`${thClass}`} onClick={() => onSort('ticker')}>
                <div className="flex items-center">Ticker {renderSortIcon('ticker')}</div>
              </TableHead>
              <TableHead className={`${thClass}`} onClick={() => onSort('name')}>
                <div className="flex items-center">Name {renderSortIcon('name')}</div>
              </TableHead>
              <TableHead className={`${thClass} text-right`} onClick={() => onSort('price')}>
                <div className="flex items-center justify-end">Price {renderSortIcon('price')}</div>
              </TableHead>
              <TableHead className={`${thClass} text-right`} onClick={() => onSort('changesPercentage')}>
                <div className="flex items-center justify-end">Change {renderSortIcon('changesPercentage')}</div>
              </TableHead>
              <TableHead className={`${thClass} text-right`} onClick={() => onSort('marketCap')}>
                <div className="flex items-center justify-end">Mkt Cap {renderSortIcon('marketCap')}</div>
              </TableHead>
              <TableHead className={`${thClass} text-right border-r-0`} onClick={() => onSort('pe')}>
                 <div className="flex items-center justify-end">P/E {renderSortIcon('pe')}</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow 
                key={stock.ticker} 
                className="border-b transition-colors hover:bg-muted/30 cursor-pointer group"
                onClick={() => onRowClick(stock)}
              >
                <TableCell className={`${tdClass} font-bold text-xs tracking-wider`}>{stock.ticker}</TableCell>
                <TableCell className={tdClass}>{stock.name}</TableCell>
                <TableCell className={`${tdClass} text-right font-mono`}>{formatMoney(stock.price)}</TableCell>
                <TableCell className={`${tdClass} text-right`}>
                  <Badge variant={stock.changesPercentage >= 0 ? 'success' : 'warning'} className="rounded-none px-1 py-0 text-[10px] font-mono h-5">
                    {stock.changesPercentage > 0 ? '+' : ''}{stock.changesPercentage.toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell className={`${tdClass} text-right font-mono`}>{formatMarketCap(stock.marketCap)}</TableCell>
                <TableCell className={`${tdClass} text-right font-mono border-r-0`}>{stock.pe ? stock.pe.toFixed(2) : '-'}</TableCell>
              </TableRow>
            ))}
            {stocks.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground uppercase tracking-widest text-xs">
                        No results found
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
