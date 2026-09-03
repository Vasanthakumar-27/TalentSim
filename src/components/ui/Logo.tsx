import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'triangle' | 'bubble' | 'hexagon';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'triangle',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', gap: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 'w-14 h-14', text: 'text-4xl', gap: 'gap-4' },
  };

  const { icon, text, gap } = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${gap} ${className}`}>
      {/* Brand Icon */}
      <div className={`relative ${icon} flex items-center justify-center`}>
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur-sm opacity-70 animate-pulse-slow"></div>

        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full text-white drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A18" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FFC857" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A18" />
              <stop offset="100%" stopColor="#FFC857" />
            </linearGradient>
          </defs>


          {variant === 'triangle' && (
            <>
              {/* Triangular Growth Symbol */}
              <polygon
                points="50,10 90,85 10,85"
                fill="url(#logoGradient)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Inner T path */}
              <path
                d="M34,36 H66 M50,36 V72"
                stroke="#FAFAFA"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="22" r="3" fill="#67E8F9" />
            </>
          )}

          {variant === 'bubble' && (
            <>
              {/* Speech Bubble Symbol */}
              <path
                d="M20,20 H80 C85.5,20 90,24.5 90,30 V60 C90,65.5 85.5,70 80,70 H45 L25,85 V70 H20 C14.5,70 10,65.5 10,60 V30 C10,24.5 14.5,20 20,20 Z"
                fill="url(#logoGradient)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <path
                d="M36,36 H64 M50,36 V60"
                stroke="#FAFAFA"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </>
          )}

          {variant === 'hexagon' && (
            <>
              {/* Hexagon AI Symbol */}
              <polygon
                points="50,8 88,28 88,72 50,92 12,72 12,28"
                fill="url(#logoGradient)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              {/* AI Nodes */}
              <circle cx="50" cy="18" r="4" fill="#67E8F9" />
              <circle cx="78" cy="34" r="4" fill="#67E8F9" />
              <circle cx="78" cy="66" r="4" fill="#67E8F9" />
              <circle cx="22" cy="34" r="4" fill="#67E8F9" />
              <path
                d="M36,38 H64 M50,38 V66"
                stroke="#FAFAFA"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </div>

      {/* Text Brand */}
      {showText && (
        <span className={`font-display font-extrabold tracking-tight ${text} text-white flex items-center`}>
          Talent<span className="gradient-text-primary">Sim</span>
        </span>
      )}
    </div>
  );
};
