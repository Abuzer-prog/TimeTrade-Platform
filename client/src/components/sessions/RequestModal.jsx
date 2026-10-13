import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { bookingApi } from '../../api/bookingApi';
import { Clock, Calendar, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const RequestModal = ({ session, isOpen, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await bookingApi.requestSlot({
        sessionId: session._id,
        message: message.trim(),
      });
      toast.success('Slot request sent to session host!');
      setMessage('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to submit slot request. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Time-Exchange Slot">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Session brief */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {session.category}
          </p>
          <h4 className="text-sm font-bold text-slate-800 line-clamp-2">{session.title}</h4>
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {session.durationMinutes} mins
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {session.timeSlot}
            </span>
          </div>
        </div>

        {/* Message input */}
        <div>
          <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Introductory Note / Learning Goals (Optional)
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself and mention what you'd like to work on or trade (e.g. 'Hey, I'd like to review Question 4 from the assignment...')"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            maxLength={500}
          />
          <p className="text-[11px] text-slate-400 text-right mt-1">
            {message.length}/500 characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {isSubmitting ? 'Sending Request...' : 'Send Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
