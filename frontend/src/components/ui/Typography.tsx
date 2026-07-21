import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<TypographyProps & { kicker?: string }> = ({ children, kicker, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {kicker && (
      <span className="text-volt text-[11px] font-bold uppercase tracking-[0.3em]">{kicker}</span>
    )}
    <h2 className="font-anton text-3xl md:text-5xl uppercase leading-none">{children}</h2>
  </div>
);

export const PageTitle: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`font-anton text-3xl md:text-4xl uppercase leading-none ${className}`}>{children}</h1>
);

export const Muted: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-muted text-sm leading-relaxed ${className}`}>{children}</p>
);
