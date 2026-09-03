/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        card: {
          DEFAULT: '#162033',
          hover: '#1F2D47',
          border: '#263756',
        },
        primary: {
          DEFAULT: '#FF7A18',
          hover: '#E8690C',
          light: '#FFB277',
          glow: 'rgba(255, 122, 24, 0.35)',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FCD34D',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
        accent: {
          DEFAULT: '#FFC857',
          hover: '#FBBF24',
          light: '#FDE68A',
          glow: 'rgba(255, 200, 87, 0.3)',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(255, 122, 24, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(255, 200, 87, 0.4)',
        'glass': '0 8px 32px 0 rgba(11, 17, 32, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
}
