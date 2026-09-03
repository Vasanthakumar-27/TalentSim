import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Target,
  Video,
  BarChart3,
  Sparkles,
  User,
  Settings as SettingsIcon,
  Award,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume AI', path: '/resume', icon: FileText },
    { name: 'Practice Track', path: '/practice', icon: Target },
    { name: 'Interview Setup', path: '/interview/setup', icon: Video },
    { name: 'Reports & Replay', path: '/interview/report', icon: BarChart3 },
    { name: 'AI Coach', path: '/coach', icon: Sparkles },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-slate-950/60 border-r border-orange-500/15 p-4 space-y-6 min-h-[calc(100vh-4rem)]">
      {/* Navigation Group */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-2">
          Platform Navigation
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-yellow-400/5 border border-orange-500/25 rounded-xl shadow-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="relative z-10 w-3.5 h-3.5 text-primary" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Readiness Badge Card */}
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="p-4 rounded-xl glass-card border border-orange-500/25 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-300">Readiness Score</span>
          <Award className="w-4 h-4 text-accent" />
        </div>
        <div className="text-2xl font-bold text-white mb-1">88%</div>
        <p className="text-xs text-emerald-400 font-medium">Ready for Tier-1 Tech Interviews</p>
      </motion.div>
    </aside>
  );
};

