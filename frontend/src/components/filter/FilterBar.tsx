import type { Dispatch, SetStateAction } from 'react';
import type { FilterState, ProductCategory } from '../../types';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input';
import { VoiceSearch } from './VoiceSearch';

interface FilterBarProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  categories: string[];
  totalResults: number;
}

export function FilterBar({ filters, setFilters, categories, totalResults }: FilterBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, q: e.target.value, page: 1 }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      category: e.target.value ? (e.target.value as ProductCategory) : undefined,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, per_page: 12 });
  };

  const hasActiveFilters = !!(filters.q || filters.category || filters.min_price || filters.max_price);

  return (
    <div className="sticky top-20 z-40 w-full bg-bg/95 backdrop-blur-md border-y border-gray-200 shadow-sm py-4 mb-8 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search products..."
                value={filters.q || ''}
                onChange={handleSearchChange}
                icon={<Search size={18} />}
                className="bg-white"
              />
            </div>
            
            <VoiceSearch setFilters={setFilters} />
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            <div className="relative flex items-center bg-white border border-gray-300 rounded-sm h-11 px-3">
              <SlidersHorizontal size={16} className="text-gray-500 mr-2" />
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium outline-none text-secondary"
                value={filters.category || ''}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-text-muted font-medium whitespace-nowrap hidden lg:block">
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Active Filters:</span>
            
            {filters.q && (
              <span className="flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-sm">
                Search: {filters.q}
                <button type="button" onClick={() => setFilters(prev => ({ ...prev, q: undefined }))} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}
            
            {filters.category && (
              <span className="flex items-center gap-1 bg-primary/10 text-primary-dark text-xs px-2 py-1 rounded-sm font-medium">
                Category: {filters.category}
                <button type="button" onClick={() => setFilters(prev => ({ ...prev, category: undefined }))} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            {filters.max_price && (
              <span className="flex items-center gap-1 bg-accent/10 text-accent text-xs px-2 py-1 rounded-sm font-medium">
                Under ${filters.max_price}
                <button type="button" onClick={() => setFilters(prev => ({ ...prev, max_price: undefined }))} className="hover:text-red-500"><X size={12} /></button>
              </span>
            )}

            <button 
              type="button"
              onClick={clearFilters}
              className="text-xs text-text-muted hover:text-red-500 transition-colors underline underline-offset-2 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
