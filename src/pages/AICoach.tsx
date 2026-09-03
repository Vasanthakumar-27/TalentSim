import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const AICoach: React.FC = () => {
  const navigate = useNavigate();

  const recommendedExercises = [
    {
      title: 'STAR Response Structuring Drill',
      cat: 'Behavioral & Leadership',
      duration: '5 Mins',
      gain: '+4% Readiness',
      desc: 'Practice articulating Situation, Task, Action, and Result with quantitative metrics.',
      badgeColor: 'purple' as const,
    },
    {
      title: 'Filler Word Elimination Challenge',
      cat: 'Speech & Cadence',
      duration: '3 Mins',
      gain: '+3% Readiness',
      desc: 'Speak for 2 minutes straight without using "um", "like", or "you know".',
      badgeColor: 'amber' as const,
    },
    {
      title: 'Technical Trade-off Justification',
      cat: 'System Architecture',
      duration: '7 Mins',
      gain: '+4% Readiness',
      desc: 'Compare SQL vs NoSQL or Client vs Server rendering with live AI follow-up probing.',
      badgeColor: 'blue' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-orange-500/20 bg-gradient-to-r from-orange-950/30 via-slate-900 to-zinc-900 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-300">
            <Sparkles className="w-3.5 h-3.5" /> PERSONALIZED AI COACHING ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Targeted Performance Coach
          </h1>
          <p className="text-sm text-zinc-400">
            AI-generated action plan based on your last 12 interview simulations.
          </p>
        </div>

        <div className="bg-zinc-900 border border-orange-500/30 p-3 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-300 font-bold">
            +11%
          </div>
          <div className="text-xs">
            <div className="text-white font-bold">Expected Growth</div>
            <div className="text-zinc-400">Upon completing today's drills</div>
          </div>
        </div>
      </div>

      {/* Strength vs Weakness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-zinc-900 to-zinc-950 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Today's Core Strength
            </span>
            <Badge variant="green">High Score</Badge>
          </div>
          <h3 className="text-lg font-bold text-white">Excellent Technical Communication</h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your technical breakdown of React hydration and state management was clear, well-paced, and demonstrated strong architectural depth.
          </p>
        </Card>

        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-zinc-900 to-zinc-950 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Target Weakness To Fix
            </span>
            <Badge variant="amber">Needs Focus</Badge>
          </div>
          <h3 className="text-lg font-bold text-white">Frequent Filler Words During Pauses</h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            You averaged 3.2 filler words ("um", "like") per response during pause transitions. Pausing silently projects 40% higher composure.
          </p>
        </Card>
      </div>

      {/* Recommended Drills */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Recommended Action Drills</h2>
          <p className="text-xs text-zinc-400 mt-1">Short targeted micro-practice sessions to eliminate your specific weak points.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedExercises.map((ex, i) => (
            <Card key={i} hoverGlow className="space-y-4 border-zinc-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <Badge variant={ex.badgeColor}>{ex.cat}</Badge>
                  <span className="text-xs font-mono font-bold text-emerald-400">{ex.gain}</span>
                </div>
                <h3 className="text-base font-bold text-white">{ex.title}</h3>
                <p className="text-xs text-zinc-400">{ex.desc}</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                glow
                onClick={() => navigate('/interview/setup')}
                className="w-full justify-center"
                leftIcon={<Zap className="w-3.5 h-3.5" />}
              >
                Start Drill ({ex.duration})
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
