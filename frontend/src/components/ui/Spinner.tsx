import React from 'react';

export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex justify-center py-12 ${className}`}>
    <div className="h-8 w-8 border-2 border-outline border-t-volt rounded-full animate-spin" />
  </div>
);

export const EmptyState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border border-dashed border-outline px-6 py-12 text-center text-muted text-sm">
    {children}
  </div>
);
