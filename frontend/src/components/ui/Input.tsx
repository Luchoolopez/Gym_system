import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-graphite border px-4 py-3 text-sm text-on-surface placeholder:text-muted/50 outline-none transition-colors duration-300 focus:border-volt disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-graphite/40 ${error ? 'border-error' : 'border-outline'} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
};
