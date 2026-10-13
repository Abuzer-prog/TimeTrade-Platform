import React from 'react';
import { History, CheckCircle, Award } from 'lucide-react';
import { CategoryBadge, StatusBadge } from '../common/Badge';

export const CompletedHistoryTab = ({ completedSessions, acceptedBookings }) => {
  const hasHistory =
    (completedSessions && completedSessions.length > 0) ||
    (acceptedBookings && acceptedBookings.length > 0);

  if (!hasHistory) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4">
          <History className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No Exchange History Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Completed time-exchange sessions and confirmed peer learning meetings will be archived here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-medium">Completed Offerings</p>
            <p className="text-xl font-extrabold text-emerald-950">
              {completedSessions?.length || 0} Sessions
            </p>
          </div>
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-indigo-800 font-medium">Accepted Engagements</p>
            <p className="text-xl font-extrabold text-indigo-950">
              {acceptedBookings?.length || 0} Bookings
            </p>
          </div>
        </div>
      </div>

      {/* List of completed sessions */}
      {completedSessions && completedSessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Sessions You Hosted & Completed
          </h4>
          <div className="space-y-2">
            {completedSessions.map((session) => (
              <div
                key={session._id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={session.category} />
                    <StatusBadge status="Completed" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">{session.title}</h5>
                  <p className="text-xs text-slate-500">{session.timeSlot}</p>
                </div>
                <div className="text-right text-xs font-semibold text-emerald-600 shrink-0">
                  +{session.durationMinutes} mins taught
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List of accepted bookings */}
      {acceptedBookings && acceptedBookings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Peer Exchanges You Attended
          </h4>
          <div className="space-y-2">
            {acceptedBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h5 className="text-sm font-bold text-slate-800">{b.session?.title}</h5>
                  <p className="text-xs text-slate-500">
                    Host: {b.creator?.name || 'Peer'} ({b.creator?.department})
                  </p>
                </div>
                <div className="text-right text-xs font-semibold text-indigo-600 shrink-0">
                  Confirmed Exchange
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
