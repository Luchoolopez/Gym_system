import React from 'react';

type ChipVariant = 'volt' | 'neutral' | 'success' | 'warning' | 'error';

interface ChipProps {
  variant?: ChipVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  volt: 'bg-volt/10 text-volt border-volt/40',
  neutral: 'bg-smoke/40 text-muted border-outline',
  success: 'bg-success/10 text-success border-success/40',
  warning: 'bg-warning/10 text-warning border-warning/40',
  error: 'bg-error/10 text-error border-error/40',
};

export const Chip: React.FC<ChipProps> = ({ variant = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${variantStyles[variant]} ${className}`}
  >
    {children}
  </span>
);
