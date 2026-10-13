import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Clock, Calendar, CheckCircle } from 'lucide-react';
import { CategoryBadge, StatusBadge } from '../common/Badge';
import { sessionApi } from '../../api/sessionApi';
import toast from 'react-hot-toast';

export const ActiveSessionsTab = ({ sessions, onRefresh }) => {
  const handleDelete = async (sessionId, title) => {
    if (!window.confirm(`Are you sure you want to delete session: "${title}"?`)) {
      return;
    }

    try {
      await sessionApi.deleteSession(sessionId);
      toast.success('Session deleted successfully');
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete session');
    }
  };

  const handleMarkCompleted = async (session) => {
    try {
      await sessionApi.updateSession(session._id, { status: 'Completed' });
      toast.success('Session marked as completed!');
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <PlusCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No Active Offerings Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
          Offer your study notes, coding pair assistance, or exam preparation slots to peer students.
        </p>
        <Link
          to="/sessions/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Create Session Offering
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-bold text-slate-800">
          Your Offered Sessions ({sessions.length})
        </h3>
        <Link
          to="/sessions/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          New Offering
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <CategoryBadge category={session.category} />
                <StatusBadge status={session.status} />
              </div>

              <Link to={`/sessions/${session._id}`}>
                <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                  {session.title}
                </h4>
              </Link>

              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {session.description}
              </p>

              <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{session.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{session.timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link
                  to={`/sessions/edit/${session._id}`}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit session"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(session._id, session.title)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {session.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => handleMarkCompleted(session)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
