import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sessionApi } from '../api/sessionApi';
import { Edit, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { FullPageSpinner } from '../components/common/Spinner';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Notes',
  'Coding',
  'Presentation Practice',
  'Academic Support',
  'Other',
];

const STATUSES = ['Open', 'Booked', 'Completed', 'Cancelled'];

export const EditSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Coding',
    description: '',
    skillOffered: '',
    durationMinutes: 45,
    timeSlot: '',
    status: 'Open',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await sessionApi.getSessionById(id);
        const session = res.data?.session;
        if (session) {
          setFormData({
            title: session.title || '',
            category: session.category || 'Coding',
            description: session.description || '',
            skillOffered: session.skillOffered || '',
            durationMinutes: session.durationMinutes || 45,
            timeSlot: session.timeSlot || '',
            status: session.status || 'Open',
          });
        }
      } catch (error) {
        toast.error('Failed to load session details.');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sessionApi.updateSession(id, formData);
      toast.success('Session updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update session');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FullPageSpinner message="Loading session to edit..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Edit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Edit Session Offering
            </h1>
            <p className="text-xs text-slate-500">
              Update scheduling, topic descriptions, or availability status.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Session Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={120}
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category, Status & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="durationMinutes" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Duration (Mins)
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  id="durationMinutes"
                  name="durationMinutes"
                  required
                  min={10}
                  max={240}
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Time Slot */}
          <div>
            <label htmlFor="timeSlot" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Available Time Slot / Preferred Schedule
            </label>
            <input
              type="text"
              id="timeSlot"
              name="timeSlot"
              required
              value={formData.timeSlot}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Skill Offered */}
          <div>
            <label htmlFor="skillOffered" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Key Skills / Concepts
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="skillOffered"
                name="skillOffered"
                value={formData.skillOffered}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Detailed Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
