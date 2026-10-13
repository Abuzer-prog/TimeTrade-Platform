import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sessionApi } from '../api/sessionApi';
import { PlusCircle, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Notes',
  'Coding',
  'Presentation Practice',
  'Academic Support',
  'Other',
];

export const CreateSessionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Coding',
    description: '',
    skillOffered: '',
    durationMinutes: 45,
    timeSlot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.timeSlot.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sessionApi.createSession(formData);
      toast.success('Session offering created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create session');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Offer a Time-Exchange Session
            </h1>
            <p className="text-xs text-slate-500">
              Share your skills, lecture notes, or review sessions with classmates.
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
              placeholder="e.g. React Router v6 & Protected Routes Walkthrough"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Category <span className="text-rose-500">*</span>
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
              <label htmlFor="durationMinutes" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Duration (Minutes) <span className="text-rose-500">*</span>
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
              Available Time Slot / Preferred Schedule <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="timeSlot"
              name="timeSlot"
              required
              value={formData.timeSlot}
              onChange={handleChange}
              placeholder="e.g. Wednesday at 4:30 PM EST or Weekends anytime"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Skill Offered */}
          <div>
            <label htmlFor="skillOffered" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Key Skills / Concepts (Comma-separated)
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="skillOffered"
                name="skillOffered"
                value={formData.skillOffered}
                onChange={handleChange}
                placeholder="e.g. React, Tailwind CSS, REST APIs"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              maxLength={1000}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what you plan to cover, prerequisites, what notes you are offering, or what format this exchange will take..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
            <p className="text-[11px] text-slate-400 text-right mt-1">
              {formData.description.length}/1000 characters
            </p>
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
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Offering...' : 'Publish Session Offering'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
