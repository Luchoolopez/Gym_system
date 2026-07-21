import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'uppercase inline-flex items-center justify-center gap-2 font-hanken font-bold tracking-[0.12em] transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-7 py-3.5 text-[13px]',
  };

  const variantStyles = {
    primary:
      'bg-volt text-carbon border border-volt hover:bg-transparent hover:text-volt',
    secondary:
      'bg-transparent text-on-surface border border-outline hover:border-volt hover:text-volt',
    ghost:
      'bg-transparent text-muted border border-transparent hover:text-volt',
    danger:
      'bg-transparent text-error border border-error/40 hover:bg-error hover:text-carbon hover:border-error',
  };

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
