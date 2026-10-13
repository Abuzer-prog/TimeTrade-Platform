import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Notes',
  'Coding',
  'Presentation Practice',
  'Academic Support',
  'Other',
];

export const SessionFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  onReset,
}) => {
  const hasActiveFilters = search !== '' || category !== 'All' || status !== 'Open';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-8 space-y-4">
      {/* Top row: Search and Status select */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics, skills, notes, or technologies (e.g. React, Notes, Math)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 sm:w-44">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="Open">Status: Available (Open)</option>
              <option value="Booked">Status: Booked</option>
              <option value="all">Status: All Statuses</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 border border-rose-200"
              title="Reset Filters"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1 shrink-0">
          <Filter className="h-3 w-3" /> Topic:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
