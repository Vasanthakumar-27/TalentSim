import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';


interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  hoverGlow?: boolean;
  glass?: boolean;
  className?: string;
  animateHover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverGlow = false,
  glass = true,
  className = '',
  animateHover = true,
  ...props
}) => {
  const baseCard = glass ? 'glass-card' : 'bg-surface border border-border';
  const glow = hoverGlow ? 'hover:border-primary/50 transition-colors duration-300 hover:shadow-glow-primary' : '';

  return (
    <motion.div
      whileHover={animateHover ? { y: -3, scale: 1.005 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`rounded-2xl p-6 ${baseCard} ${glow} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mb-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h3 className={`text-lg font-semibold text-white tracking-tight ${className}`}>{children}</h3>;

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-sm text-zinc-400 mt-1 ${className}`}>{children}</p>;

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`${className}`}>{children}</div>;

