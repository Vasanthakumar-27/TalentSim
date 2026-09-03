import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { useAuth } from '../../store/authStore';
import { Play, Menu, X, ChevronRight, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Practice', path: '/practice' },
    { name: 'Resume AI', path: '/resume' },
    { name: 'AI Coach', path: '/coach' },
    { name: 'Reports', path: '/interview/report' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-orange-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="md" variant="triangle" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-orange-500/10 border border-orange-500/25 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/interview/setup">
              <Button
                variant="primary"
                size="sm"
                glow
                leftIcon={<Play className="w-4 h-4 fill-white" />}
              >
                Start Interview
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/profile" className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-300 flex items-center justify-center text-xs font-bold text-slate-950 shadow-md hover:scale-105 transition-transform">
                  V
                </div>
              </Link>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/25 bg-orange-500/5 px-2.5 py-1.5 text-xs font-medium text-orange-200 transition hover:border-orange-400/40 hover:bg-orange-500/10"
                  aria-label="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/interview/setup">
              <Button variant="primary" size="sm">
                Practice
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
            ))}
            <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
              <Link to="/interview/setup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center">
                  Start Interview Session
                </Button>
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  View Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

