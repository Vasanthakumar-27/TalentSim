import React from 'react';
import { useAuth } from '../store/authStore';
import { Card, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Award,
  Flame,
  FileText,
  Briefcase,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.name || 'TalentSim User';
  const initials = displayName.charAt(0).toUpperCase();
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header Banner */}
      <Card className="glass-card border-orange-500/20 p-8 relative overflow-hidden bg-gradient-to-r from-orange-950/25 via-slate-900 to-zinc-900">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-300 p-1 shadow-[0_0_30px_rgba(255,122,24,0.35)] shrink-0">
            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-3xl font-extrabold text-white">
              {initials}
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{displayName}</h1>
              <Badge variant="blue">Candidate Profile</Badge>
            </div>
            <p className="text-xs text-zinc-400 font-mono">{user?.email || 'No email available'}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-300 pt-1">
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-blue-400" /> Target: Senior Frontend Engineer</span>
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-500" /> Practice activity is tracked per session</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats & Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-800 space-y-3">
          <div className="text-xs text-zinc-400 font-semibold">Total Interviews Completed</div>
          <div className="text-3xl font-extrabold text-white">--</div>
          <p className="text-xs text-zinc-400">Open Dashboard for saved session metrics</p>
        </Card>

        <Card className="border-zinc-800 space-y-3">
          <div className="text-xs text-zinc-400 font-semibold">Target Companies Practiced</div>
          <div className="text-3xl font-extrabold text-cyan-400">--</div>
          <p className="text-xs text-zinc-400">Calculated from saved sessions</p>
        </Card>

        <Card className="border-zinc-800 space-y-3">
          <div className="text-xs text-zinc-400 font-semibold">Active Resume</div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" /> No resume uploaded
          </div>
          <Badge variant="amber" size="sm">Not analyzed</Badge>
        </Card>
      </div>

      {/* Achievements & Readiness Badges */}
      <Card className="border-zinc-800 space-y-4">
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Candidate Achievements & Readiness Badges
        </CardTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ name: 'Interview history', desc: 'Complete a session to build your profile', badge: 'Available', color: 'blue' }].map((item, idx) => (
            <div key={idx} className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 text-center space-y-1.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-zinc-800 flex items-center justify-center">
                <Award className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-sm font-bold text-white">{item.name}</div>
              <p className="text-xs text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
