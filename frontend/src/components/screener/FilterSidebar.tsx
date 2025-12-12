"use client"
import React from 'react';
import { FilterCriteria } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface FilterSidebarProps {
  filters: FilterCriteria;
  onFilterChange: (newFilters: FilterCriteria) => void;
  className?: string;
}

const SECTORS = [
  'All',
  'Technology',
  'Financial Services',
  'Healthcare',
  'Consumer Cyclical',
  'Consumer Defensive',
  'Energy',
  'Industrials',
  'Utilities',
];

export function FilterSidebar({ filters, onFilterChange, className }: FilterSidebarProps) {
  const handleChange = (key: keyof FilterCriteria, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block";
  // Swiss-style input: minimal, no rounding primarily
  const inputClass = "h-8 rounded-none border-t-0 border-x-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-black placeholder:text-muted-foreground/50";

  return (
    <div className={`p-6 space-y-8 ${className}`}>
      <div>
        <label className={labelClass}>Search</label>
        <Input
          placeholder="TICKER OR NAME"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Market Cap (B)</label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="MIN"
            value={filters.marketCapMin ? filters.marketCapMin / 1000000000 : ''}
            onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) * 1000000000 : undefined;
                handleChange('marketCapMin', val);
            }}
             className={inputClass}
          />
          <Input
            type="number"
            placeholder="MAX"
            value={filters.marketCapMax ? filters.marketCapMax / 1000000000 : ''}
            onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) * 1000000000 : undefined;
                handleChange('marketCapMax', val);
            }}
             className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>P/E Ratio</label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="MIN"
            value={filters.peMin || ''}
            onChange={(e) => handleChange('peMin', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
          <Input
            type="number"
            placeholder="MAX"
            value={filters.peMax || ''}
            onChange={(e) => handleChange('peMax', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Price ($)</label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="MIN"
            value={filters.priceMin || ''}
            onChange={(e) => handleChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
          <Input
            type="number"
            placeholder="MAX"
            value={filters.priceMax || ''}
            onChange={(e) => handleChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Div Yield (%)</label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="MIN"
            value={filters.dividendYieldMin || ''}
            onChange={(e) => handleChange('dividendYieldMin', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
          <Input
            type="number"
            placeholder="MAX"
            value={filters.dividendYieldMax || ''}
            onChange={(e) => handleChange('dividendYieldMax', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>52-Week High</label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="MIN"
            value={filters.high52WeekMin || ''}
            onChange={(e) => handleChange('high52WeekMin', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
          <Input
            type="number"
            placeholder="MAX"
            value={filters.high52WeekMax || ''}
            onChange={(e) => handleChange('high52WeekMax', e.target.value ? Number(e.target.value) : undefined)}
             className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Sector</label>
        <Select
          value={filters.sector || 'All'}
          onValueChange={(val) => handleChange('sector', val)}
        >
          <SelectTrigger className="h-8 w-full rounded-none border-t-0 border-x-0 border-b border-border bg-transparent px-0 py-1 text-sm focus:ring-0 focus:border-black shadow-none data-[placeholder]:text-muted-foreground">
             <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full rounded-none uppercase tracking-widest text-xs font-bold border-black hover:bg-black hover:text-white transition-colors"
        onClick={() => onFilterChange({})}
      >
        Reset Filters
      </Button>
    </div>
  );
}
