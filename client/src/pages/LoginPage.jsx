import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, LogIn, Lock, Mail, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { name: 'Alex Chen', email: 'alex.chen@university.edu', role: 'React Host' },
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@university.edu', role: 'Notes Host' },
  { name: 'Marcus Taylor', email: 'marcus.taylor@university.edu', role: 'Presentation Coach' },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 mb-4">
            <Clock className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Sign in to TimeTrade
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Access your student time-exchange dashboard and active bookings.
          </p>
        </div>

        {/* Quick Fill Test Accounts */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Quick Demo Accounts (1-Click Fill)
          </p>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickFill(acc.email)}
                className="text-xs bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-colors shadow-2xs"
              >
                {acc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
