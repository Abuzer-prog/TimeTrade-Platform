import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-indigo-600 border-t-transparent ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const FullPageSpinner = ({ message = 'Loading TimeTrade...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">{message}</p>
    </div>
  );
};
