import React from 'react';
import { Send, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { bookingApi } from '../../api/bookingApi';
import toast from 'react-hot-toast';

export const SentRequestsTab = ({ requests, onRefresh }) => {
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this slot request?')) {
      return;
    }

    try {
      await bookingApi.cancelRequest(bookingId);
      toast.success('Request cancelled');
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel request');
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4">
          <Send className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No Outgoing Requests</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore the session marketplace and request a time slot to exchange knowledge with peers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-bold text-slate-800">
          Sent Slot Requests ({requests.length})
        </h3>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Host and Session Info */}
            <div className="flex items-start gap-3.5">
              <img
                src={
                  req.creator?.avatarUrl ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${req.creator?.email || 'host'}`
                }
                alt={req.creator?.name || 'Host'}
                className="h-10 w-10 rounded-full border border-slate-200 object-cover shrink-0 mt-0.5"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    Host: {req.creator?.name || 'Peer Host'}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {req.creator?.department || 'University'}
                  </span>
                  <StatusBadge status={req.status} />
                </div>

                <p className="text-xs font-semibold text-indigo-600">
                  {req.session?.title || 'Session'}
                </p>

                {req.message && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg">
                    "{req.message}"
                  </p>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                  <Clock className="h-3 w-3" />
                  <span>Submitted {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="self-end md:self-center shrink-0">
              {['Pending', 'Accepted'].includes(req.status) && (
                <button
                  type="button"
                  onClick={() => handleCancel(req._id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
