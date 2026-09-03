import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0 to 100
  variant?: 'blue' | 'purple' | 'cyan' | 'green' | 'amber' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'gradient',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  const sizeMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantMap = {
    blue: 'bg-primary',
    purple: 'bg-secondary',
    cyan: 'bg-accent',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-zinc-400 font-medium">Progress</span>
          <span className="text-zinc-200 font-bold">{Math.round(normalizedValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-zinc-800/80 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalizedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
          className={`h-full rounded-full ${variantMap[variant]}`}
        />


      </div>
    </div>
  );
};

