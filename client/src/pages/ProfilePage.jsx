import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { User, Mail, GraduationCap, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Data Science',
  'Software Engineering',
  'Mathematics & Computing',
  'Electronics & Communication',
  'Business Administration',
  'Other',
];

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || 'Computer Science',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await authApi.updateProfile(formData);
      if (res.data?.user) {
        updateUser(res.data.user);
        toast.success('Profile details updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={
              formData.avatarUrl ||
              user?.avatarUrl ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`
            }
            alt={user?.name}
            className="h-16 w-16 rounded-2xl border-2 border-indigo-100 object-cover shrink-0"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Student Profile
            </h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Department / Major
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Avatar Image URL (Optional)
            </label>
            <input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Bio & Academic Interests
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={240}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell peers what subjects or technologies you enjoy discussing..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
