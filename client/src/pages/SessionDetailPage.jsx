import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/sessionApi';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import { RequestModal } from '../components/sessions/RequestModal';
import { FullPageSpinner } from '../components/common/Spinner';
import {
  Clock,
  Calendar,
  Sparkles,
  ArrowLeft,
  User,
  GraduationCap,
  Mail,
  Edit,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const res = await sessionApi.getSessionById(id);
      setSession(res.data?.session || null);
    } catch (error) {
      toast.error('Session not found or has been removed.');
      navigate('/marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  if (isLoading) {
    return <FullPageSpinner message="Loading session offering details..." />;
  }

  if (!session) return null;

  const isCreator = user && session.creator && user.id === session.creator._id;
  const isAvailable = session.status === 'Open';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={session.category} />
            <StatusBadge status={session.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {session.title}
          </h1>

          {/* Time & Duration banner */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span className="font-semibold">{session.durationMinutes} minutes duration</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="font-semibold">{session.timeSlot}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About This Exchange
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {session.description}
          </p>
        </div>

        {/* Skill Offered */}
        {session.skillOffered && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Skills & Concepts Covered
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{session.skillOffered}</span>
            </div>
          </div>
        )}

        {/* Host Profile Info Card */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Offered By
          </h3>
          <div className="flex items-start gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <img
              src={
                session.creator?.avatarUrl ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${session.creator?.email}`
              }
              alt={session.creator?.name}
              className="h-14 w-14 rounded-full border-2 border-white shadow-xs object-cover shrink-0"
            />
            <div className="space-y-1 min-w-0">
              <h4 className="text-base font-bold text-slate-900">{session.creator?.name}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                <span>{session.creator?.department || 'Student'}</span>
              </div>
              {session.creator?.bio && (
                <p className="text-xs text-slate-600 pt-1 leading-relaxed">{session.creator.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Posted on {new Date(session.createdAt).toLocaleDateString()}
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isCreator ? (
              <>
                <Link
                  to={`/sessions/edit/${session._id}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Offering
                </Link>
                <Link
                  to="/dashboard"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Manage In Dashboard
                </Link>
              </>
            ) : isAvailable ? (
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
              >
                <Send className="h-4 w-4" />
                Request Time Slot
              </button>
            ) : (
              <div className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2.5 rounded-xl">
                This session is currently {session.status}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slot Request Modal */}
      <RequestModal
        session={session}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchSession()}
      />
    </div>
  );
};
