import React, { useState, useEffect, useCallback } from 'react';
import { sessionApi } from '../api/sessionApi';
import { SessionCard } from '../components/sessions/SessionCard';
import { SessionFilter } from '../components/sessions/SessionFilter';
import { RequestModal } from '../components/sessions/RequestModal';
import { Spinner } from '../components/common/Spinner';
import { Compass, AlertCircle } from 'lucide-react';

export const MarketplacePage = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('Open');

  // Request Modal state
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search input to avoid excessive API queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const loadSessions = useCallback(
    async (pageToLoad = 1) => {
      setIsLoading(true);
      try {
        const params = {
          page: pageToLoad,
          limit: 12,
        };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (category !== 'All') params.category = category;
        if (status) params.status = status;

        const res = await sessionApi.getMarketplaceSessions(params);
        setSessions(res.data?.sessions || []);
        if (res.data?.pagination) {
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to load sessions', err);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, category, status]
  );

  useEffect(() => {
    loadSessions(1);
  }, [loadSessions]);

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('All');
    setStatus('Open');
  };

  const handleOpenRequest = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="h-4 w-4" />
          <span>Peer Time-Exchange Board</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Session Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Browse offerings from university peers or search specific study subjects, coding concepts, and presentation reviews.
        </p>
      </div>

      {/* Filter Component */}
      <SessionFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        onReset={handleResetFilters}
      />

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" />
          <p className="mt-4 text-xs font-semibold text-slate-500">Searching marketplace offerings...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No Matching Offerings</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            No sessions match your search criteria. Try modifying your search keywords or resetting the topic filter.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onRequestSlot={handleOpenRequest}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={!pagination.hasPrev}
                onClick={() => loadSessions(pagination.page - 1)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-slate-500 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={!pagination.hasNext}
                onClick={() => loadSessions(pagination.page + 1)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Request Modal */}
      <RequestModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadSessions(pagination.page)}
      />
    </div>
  );
};
