import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { CategoryBadge, StatusBadge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

export const SessionCard = ({ session, onRequestSlot }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isCreator = user && session.creator && user.id === session.creator._id;
  const isAvailable = session.status === 'Open';

  const handleRequestClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onRequestSlot(session);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 group">
      {/* Top Header: Creator info & Category badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              session.creator?.avatarUrl ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${session.creator?.email || 'user'}`
            }
            alt={session.creator?.name || 'Student'}
            className="h-10 w-10 rounded-full border border-slate-100 object-cover shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {session.creator?.name || 'Student Peer'}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {session.creator?.department || 'University Student'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1">
          <CategoryBadge category={session.category} />
          <StatusBadge status={session.status} />
        </div>
      </div>

      {/* Title */}
      <Link to={`/sessions/${session._id}`} className="block group-hover:text-indigo-600 transition-colors">
        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
          {session.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-grow">
        {session.description}
      </p>

      {/* Skills Offered Tag */}
      {session.skillOffered && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md">
            <Sparkles className="h-3 w-3 text-indigo-500 shrink-0" />
            <span className="truncate">{session.skillOffered}</span>
          </span>
        </div>
      )}

      {/* Metadata Bar: Duration & TimeSlot */}
      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{session.durationMinutes} minutes session</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{session.timeSlot}</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Link
          to={`/sessions/${session._id}`}
          className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          View Details
        </Link>

        {isCreator ? (
          <Link
            to="/dashboard"
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Your Offering
          </Link>
        ) : isAvailable ? (
          <button
            type="button"
            onClick={handleRequestClick}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            Request Slot
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
          >
            {session.status}
          </button>
        )}
      </div>
    </div>
  );
};
