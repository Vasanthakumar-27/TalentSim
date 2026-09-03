import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  glow = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-hover text-white focus:ring-primary shadow-lg shadow-orange-900/35',
    secondary: 'bg-secondary hover:bg-secondary-hover text-[#0B1120] focus:ring-secondary shadow-lg shadow-amber-900/25',
    accent: 'bg-accent hover:bg-accent-hover text-[#0B1120] font-semibold focus:ring-accent shadow-lg shadow-yellow-900/25',
    outline: 'border border-orange-500/30 hover:border-orange-400 bg-slate-900/50 hover:bg-slate-800/80 text-slate-100 focus:ring-orange-400',
    ghost: 'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white focus:ring-slate-600',
    danger: 'bg-danger hover:bg-red-700 text-white focus:ring-red-500 shadow-lg shadow-red-900/30',
  };

  const glowStyles = glow ? 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#FF7A18] before:via-[#F59E0B] before:to-[#FFC857] before:opacity-0 hover:before:opacity-20 before:transition-opacity' : '';

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

