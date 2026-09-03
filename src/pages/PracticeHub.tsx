import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Zap,
  Target,
  Clock,
  ChevronRight,
  Flame,
  Layers,
  Play,
} from 'lucide-react';

export const PracticeHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const companyTracks = [
    {
      name: 'Google',
      role: 'Senior Frontend Engineer',
      focus: 'System Architecture & Web Performance',
      rounds: '4 Rounds (Tech + Behavioral)',
      difficulty: 'Expert',
      badgeColor: 'blue' as const,
      logoColor: 'text-red-400',
    },
    {
      name: 'Amazon',
      role: 'SDE II (Full Stack)',
      focus: 'Leadership Principles & Distributed Systems',
      rounds: '3 Rounds (LP + Tech)',
      difficulty: 'Hard',
      badgeColor: 'amber' as const,
      logoColor: 'text-amber-400',
    },
    {
      name: 'Zoho',
      role: 'Product Developer',
      focus: 'Algorithms, Data Structures & Problem Solving',
      rounds: '3 Rounds (Core Tech)',
      difficulty: 'Medium',
      badgeColor: 'green' as const,
      logoColor: 'text-emerald-400',
    },
    {
      name: 'Microsoft',
      role: 'Software Engineer II',
      focus: 'Object-Oriented Design & Code Quality',
      rounds: '4 Rounds (Mixed)',
      difficulty: 'Hard',
      badgeColor: 'purple' as const,
      logoColor: 'text-blue-400',
    },
    {
      name: 'Meta',
      role: 'AI / Machine Learning Lead',
      focus: 'Neural Networks, Scalability & STAR',
      rounds: '5 Rounds (Deep Tech)',
      difficulty: 'Expert',
      badgeColor: 'cyan' as const,
      logoColor: 'text-cyan-400',
    },
  ];

  const categories = ['All', 'Frontend', 'Backend', 'Fullstack', 'AI / ML', 'Behavioral'];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-card border border-orange-500/20 bg-gradient-to-r from-orange-950/30 via-zinc-900 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-300">
              <Target className="w-3.5 h-3.5" /> COMPANY-SPECIFIC PRACTICE TRACKS
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Targeted Interview Simulation Tracks
            </h1>
            <p className="text-sm text-zinc-400">
              Train with real interview formats, question banks, and behavioral metrics from top tech firms.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            glow
            onClick={() => navigate('/interview/setup')}
            leftIcon={<Play className="w-4 h-4 fill-white" />}
          >
            Custom Simulation Wizard
          </Button>
        </div>
      </div>

      {/* Daily Challenge Card */}
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-950 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Badge variant="amber" icon={<Flame className="w-3.5 h-3.5" />}>Daily 5-Min Challenge</Badge>
            <span className="text-xs text-zinc-400 font-mono">+15 XP / +2% Readiness</span>
          </div>
          <h2 className="text-xl font-bold text-white">The STAR Framework Warmup</h2>
          <p className="text-sm text-zinc-300 max-w-2xl">
            "Describe a situation where you had to make a tough technical compromise under tight deadlines."
          </p>
        </div>
        <Button variant="accent" size="md" onClick={() => navigate('/interview/setup')} leftIcon={<Zap className="w-4 h-4" />}>
          Start 5-Min Challenge
        </Button>
      </Card>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-lg shadow-blue-900/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Company Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyTracks.map((track, i) => (
          <Card key={i} hoverGlow className="space-y-4 border-zinc-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-extrabold text-white text-lg">
                    {track.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{track.name}</h3>
                    <div className="text-xs text-zinc-400">{track.role}</div>
                  </div>
                </div>
                <Badge variant={track.badgeColor}>{track.difficulty}</Badge>
              </div>

              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80 space-y-1 text-xs">
                <div className="text-zinc-400 font-semibold">Primary Evaluation Focus:</div>
                <p className="text-zinc-200">{track.focus}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-blue-400" /> {track.rounds}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> ~35 min</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between mt-4"
              onClick={() => navigate('/interview/setup')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Start {track.name} Track
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
