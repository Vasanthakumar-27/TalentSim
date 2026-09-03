import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../store/authStore';
import {
  Play,
  Award,
  Flame,
  Target,
  FileText,
  Video,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};




export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const radarData = [
    { skill: 'Technical', value: 90 },
    { skill: 'Communication', value: 85 },
    { skill: 'Confidence', value: 82 },
    { skill: 'Behavioral', value: 86 },
    { skill: 'Body Language', value: 88 },
  ];

  const recentSessions = [
    {
      id: 'session-1',
      company: 'Google',
      role: 'Senior Frontend Engineer',
      type: 'Technical & System Design',
      score: 88,
      date: 'Today, 4:15 PM',
      duration: '25 min',
      recommendation: 'Strong Hire',
      badgeColor: 'green' as const,
    },
    {
      id: 'session-2',
      company: 'Amazon',
      role: 'Software Development Engineer II',
      type: 'Leadership Principles (Behavioral)',
      score: 84,
      date: 'Yesterday, 6:30 PM',
      duration: '30 min',
      recommendation: 'Hire',
      badgeColor: 'blue' as const,
    },
    {
      id: 'session-3',
      company: 'Zoho',
      role: 'Fullstack Developer',
      type: 'HR & Technical Warmup',
      score: 91,
      date: 'Aug 5, 2:00 PM',
      duration: '20 min',
      recommendation: 'Strong Hire',
      badgeColor: 'green' as const,
    },
    {
      id: 'session-4',
      company: 'Microsoft',
      role: 'AI / ML Engineer',
      type: 'System Architecture & Algorithmic Focus',
      score: 79,
      date: 'Aug 3, 11:00 AM',
      duration: '40 min',
      recommendation: 'Borderline',
      badgeColor: 'amber' as const,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Top Banner Greeting */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-[28px] border border-orange-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(255,122,24,0.20),_transparent_30%),linear-gradient(135deg,_rgba(11,17,32,0.96),_rgba(22,32,51,0.92))] p-6 shadow-[0_20px_60px_rgba(255,122,24,0.12)]"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-200">
            <Sparkles className="w-3.5 h-3.5" /> AI interview dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Good Evening, <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">{user?.name || 'TalentSim User'} 👋</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300">
            You're on a <span className="font-semibold text-amber-300"><Flame className="mr-1 inline h-3.5 w-3.5 text-amber-300" />7-day practice streak</span>. Your readiness index rose +4% this week and your mock interview confidence is trending upward.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <Link to="/resume">
            <Button variant="outline" size="sm" leftIcon={<FileText className="w-4 h-4 text-orange-300" />}>
              Resume AI
            </Button>
          </Link>
          <Link to="/interview/setup">
            <Button variant="primary" size="sm" glow leftIcon={<Play className="w-4 h-4 fill-white" />}>
              Start Practice Session
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Index */}
        <Card hoverGlow className="relative overflow-hidden border-orange-500/20 bg-gradient-to-br from-orange-500/8 via-slate-900 to-slate-950">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-400">Interview Readiness</span>
            <Award className="w-4 h-4 text-orange-300" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">88%</div>
          <ProgressBar value={88} variant="gradient" size="sm" className="my-2" />
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Tier-1 Ready (Top 12% percentile)
          </p>
        </Card>

        {/* Today's Goal */}
        <Card hoverGlow className="border-orange-500/15 bg-gradient-to-br from-amber-500/8 via-slate-900 to-slate-950">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-400">Today's Goal</span>
            <Target className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-sm font-bold text-white mb-2">Complete HR & Technical Round</div>
          <ProgressBar value={50} variant="purple" size="sm" className="mb-2" />
          <span className="text-xs text-zinc-400">1 of 2 interviews completed</span>
        </Card>

        {/* Session Count */}
        <Card hoverGlow className="border-orange-500/15 bg-gradient-to-br from-yellow-500/8 via-slate-900 to-slate-950">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-400">Recent Sessions</span>
            <Video className="w-4 h-4 text-yellow-300" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">12</div>
          <p className="text-xs text-zinc-400">4 target companies practiced</p>
        </Card>

        {/* Practice Streak */}
        <Card hoverGlow className="border-amber-500/20 bg-gradient-to-br from-amber-500/8 via-slate-900 to-slate-950">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-400">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">7 Days</div>
          <p className="text-xs text-amber-300 font-semibold">+11% projected improvement</p>
        </Card>
      </motion.div>

      {/* Analytics & Skill Radar Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Breakdown Chart */}
        <Card className="lg:col-span-2 space-y-4 border-zinc-800">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Skill Matrix Breakdown</CardTitle>
              <CardDescription>Evaluated via real-time computer vision & speech STT engine</CardDescription>
            </div>
            <Badge variant="purple">Live AI Metrics</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Recharts Radar */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#27272A" />
                  <PolarAngleAxis dataKey="skill" stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3F3F46" />
                  <Radar name="Vasanth" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-semibold">Technical Knowledge</span>
                  <span className="text-blue-400 font-mono font-bold">90%</span>
                </div>
                <ProgressBar value={90} variant="blue" size="sm" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-semibold">Communication Clarity</span>
                  <span className="text-purple-400 font-mono font-bold">85%</span>
                </div>
                <ProgressBar value={85} variant="purple" size="sm" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-semibold">Confidence & Eye Contact</span>
                  <span className="text-cyan-400 font-mono font-bold">82%</span>
                </div>
                <ProgressBar value={82} variant="cyan" size="sm" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-semibold">Behavioral & STAR Structure</span>
                  <span className="text-emerald-400 font-mono font-bold">86%</span>
                </div>
                <ProgressBar value={86} variant="green" size="sm" />
              </div>
            </div>
          </div>
        </Card>

        {/* AI Recommendation Box */}
        <Card className="bg-gradient-to-b from-orange-500/10 via-slate-900 to-slate-950 border-orange-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-300" />
            <CardTitle>AI Coach Insight</CardTitle>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 space-y-1">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Today's Key Strength
              </span>
              <p className="text-zinc-300">Excellent architectural clarity when explaining React hydration & state management.</p>
            </div>

            <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 space-y-1">
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                ⚠️ Today's Target Fix
              </span>
              <p className="text-zinc-300">Too many filler words ("um", "like") during long pause transitions.</p>
            </div>
          </div>

          <Link to="/coach" className="block pt-2">
            <Button variant="secondary" size="sm" className="w-full justify-center">
              View Recommended Drills (+11% Boost)
            </Button>
          </Link>
        </Card>
      </motion.div>

      {/* Target Companies & Recent Sessions Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Recent Interview Sessions</CardTitle>
              <CardDescription>Review recruiter evaluation, audio replay timeline, and detailed feedback</CardDescription>
            </div>
            <Link to="/interview/report">
              <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                Open Full Replay Center
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Round Type</th>
                  <th className="py-3 px-4">Recruiter Signal</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold">
                        <Building2 className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white">{session.company}</div>
                        <div className="text-xs text-zinc-500 font-normal">{session.role}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-zinc-400">{session.type}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={session.badgeColor}>{session.recommendation}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{session.score}%</td>
                    <td className="py-3.5 px-4 text-xs text-zinc-500">{session.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to="/interview/report">
                        <Button variant="ghost" size="sm" leftIcon={<BarChart3 className="w-3.5 h-3.5" />}>
                          Report
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

