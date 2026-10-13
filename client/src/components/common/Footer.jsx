import React from 'react';
import { Clock, Github, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <Clock className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Time<span className="text-indigo-600">Trade</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              A peer-to-peer student time-exchange platform designed to facilitate collaborative
              learning, note sharing, code reviews, and capstone presentation practice.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>BCA Capstone Project • Frontend & Backend Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="hover:text-indigo-600 transition-colors">
                  Browse Sessions
                </Link>
              </li>
              <li>
                <Link to="/sessions/new" className="hover:text-indigo-600 transition-colors">
                  Offer Time & Skills
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>• Coding & Debugging</li>
              <li>• Lecture Notes Exchange</li>
              <li>• Presentation Practice</li>
              <li>• Academic Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} TimeTrade Platform. MIT Licensed.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Engineered with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for university peer learning
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
