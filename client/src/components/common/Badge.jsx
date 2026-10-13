import React from 'react';

export const CategoryBadge = ({ category, className = '' }) => {
  const styles = {
    Notes: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20',
    Coding: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    'Presentation Practice': 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
    'Academic Support': 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    Other: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
  };

  const style = styles[category] || styles.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-xs ${style} ${className}`}
    >
      {category}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const styles = {
    Open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Booked: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-slate-100 text-slate-700 border-slate-300',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const dots = {
    Open: 'bg-emerald-500',
    Booked: 'bg-indigo-500',
    Completed: 'bg-slate-400',
    Cancelled: 'bg-rose-500',
    Pending: 'bg-amber-500',
    Accepted: 'bg-emerald-500',
    Rejected: 'bg-rose-500',
  };

  const style = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const dot = dots[status] || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};
