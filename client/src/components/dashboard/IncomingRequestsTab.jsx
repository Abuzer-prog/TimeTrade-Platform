import React, { useState } from 'react';
import { Check, X, Clock, MessageSquare, Inbox } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { bookingApi } from '../../api/bookingApi';
import toast from 'react-hot-toast';

export const IncomingRequestsTab = ({ requests, onRefresh }) => {
  const [processingId, setProcessingId] = useState(null);

  const handleStatusUpdate = async (bookingId, status) => {
    setProcessingId(bookingId);
    try {
      await bookingApi.updateRequestStatus(bookingId, status);
      toast.success(
        status === 'Accepted'
          ? 'Request accepted! Session is now booked.'
          : 'Request rejected.'
      );
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update request');
    } finally {
      setProcessingId(null);
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No Incoming Requests</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          When students request slots on your session offerings, they will appear here for your review and acceptance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-bold text-slate-800">
          Incoming Slot Requests ({requests.length})
        </h3>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Requester & Session details */}
            <div className="flex items-start gap-3.5">
              <img
                src={
                  req.requester?.avatarUrl ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${req.requester?.email || 'user'}`
                }
                alt={req.requester?.name || 'Requester'}
                className="h-10 w-10 rounded-full border border-slate-200 object-cover shrink-0 mt-0.5"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    {req.requester?.name || 'Student'}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {req.requester?.department || 'University'}
                  </span>
                  <StatusBadge status={req.status} />
                </div>

                <p className="text-xs font-semibold text-indigo-600">
                  Target Session: {req.session?.title || 'Time-Exchange Session'}
                </p>

                {req.message && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="italic">"{req.message}"</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                  <Clock className="h-3 w-3" />
                  <span>Requested on {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Response action buttons */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              {req.status === 'Pending' ? (
                <>
                  <button
                    type="button"
                    disabled={processingId === req._id}
                    onClick={() => handleStatusUpdate(req._id, 'Accepted')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={processingId === req._id}
                    onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </>
              ) : (
                <span className="text-xs font-medium text-slate-400 capitalize">
                  {req.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
