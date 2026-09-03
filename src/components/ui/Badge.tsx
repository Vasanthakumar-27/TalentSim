import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'red' | 'dark';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantMap = {
    blue: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
    purple: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    cyan: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/25',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dark: 'bg-slate-800 text-slate-200 border-slate-700',
  };

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantMap[variant]} ${sizeMap[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
