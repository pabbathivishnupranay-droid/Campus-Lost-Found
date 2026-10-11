import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'ACCESSORIES', label: 'Accessories & Bags' },
  { value: 'IDS_CARDS', label: 'IDs & Campus Cards' },
  { value: 'BOOKS', label: 'Books & Stationery' },
  { value: 'OTHER', label: 'Other Items' },
];

const STATUSES = [
  { value: 'ALL', label: 'All Items' },
  { value: 'UNCLAIMED', label: 'Unclaimed' },
  { value: 'CLAIM_PENDING', label: 'Claim Pending' },
  { value: 'CLAIMED', label: 'Claimed' },
];

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}) {
  return (
    <div className="glass-panel p-4 rounded-2xl mb-8 space-y-4 border border-white/10 shadow-lg">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input with FULLTEXT search indication */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by keywords (e.g., 'blue hydro flask', 'macbook', 'library 2nd floor')..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedStatus === status.value
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
        <span className="text-xs text-slate-400 flex items-center pr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
          Category:
        </span>
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === category.value
                ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/40'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
