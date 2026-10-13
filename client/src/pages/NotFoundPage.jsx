import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-2 mb-6">
        The time-exchange page or session offering you requested does not exist or may have been removed.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Home
      </Link>
    </div>
  );
};
