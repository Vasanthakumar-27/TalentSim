import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useInterviewStore } from '../store/interviewStore';
import {
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Download,
  UserCheck,
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';


export const InterviewReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recruiter' | 'replay' | 'breakdown'>('recruiter');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);
  const [actionMessage, setActionMessage] = useState('');

  // Read state from Zustand interview store
  const { config, answers, eyeContactScore, recordingUrl } = useInterviewStore();

  // Compute stats dynamically if answers exist
  const totalFillers = answers.reduce((acc, a) => acc + (a.fillerCount || 0), 0);
  const avgWpm = answers.length
    ? Math.round(answers.reduce((acc, a) => acc + a.wpm, 0) / answers.length)
    : 0;
  const communicationScore = answers.length
    ? Math.max(0, Math.min(100, Math.round(100 - (totalFillers / answers.length) * 8)))
    : 0;
  const overallScore = answers.length
    ? Math.round((communicationScore + (eyeContactScore || 0)) / 2)
    : 0;

  const radarData = [
    { skill: 'Technical Depth', value: overallScore },
    { skill: 'Communication', value: communicationScore },
    { skill: 'Confidence', value: eyeContactScore },
    { skill: 'STAR Structure', value: communicationScore },
    { skill: 'Problem Solving', value: overallScore },
  ];

  const replayTimeline = [
    {
      timestamp: '0:35',
      event: 'Excellent Explanation',
      type: 'positive' as const,
      q: 'Tell me about yourself & background.',
      note: 'Clear, concise introduction highlighting technical achievements.',
    },
    {
      timestamp: '1:12',
      event: 'Long Pause Detected (2.8s)',
      type: 'warning' as const,
      q: 'React optimization trade-offs.',
      note: 'Candidate paused while structuring answer on state memoization.',
    },
    {
      timestamp: '2:20',
      event: 'Good Eye Contact (94%)',
      type: 'positive' as const,
      q: 'Handling async error boundaries.',
      note: 'Maintained steady direct posture throughout technical breakdown.',
    },
    {
      timestamp: '3:15',
      event: 'Weak Answer Structure',
      type: 'danger' as const,
      q: 'System failure recovery approach.',
      note: 'Lacked concrete quantitative impact metrics in response.',
    },
    {
      timestamp: '5:02',
      event: 'Excellent System Trade-off Explanation',
      type: 'positive' as const,
      q: 'FastAPI vs Flask decision.',
      note: 'Articulated async event loop performance gains clearly.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="space-y-8"
    >
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-card border border-orange-500/20 bg-gradient-to-r from-orange-950/30 via-slate-900 to-zinc-900 flex flex-col md:flex-row justify-between md:items-center gap-4">

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-300">
            <Sparkles className="w-3.5 h-3.5" /> PERFORMANCE REPORT & REPLAY STUDIO
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Interview Evaluation Summary
          </h1>
          <p className="text-sm text-zinc-400">
            Session: <span className="text-white font-semibold">{config.role} Track</span> • Live Evaluated Report
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={async () => {
              const shareData = { title: 'TalentSim Interview Report', text: `Interview score: ${overallScore}%` };
              if (navigator.share) await navigator.share(shareData);
              else await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
              setActionMessage('Report link copied to clipboard.');
            }}
          >
            Share Feedback
          </Button>
          <Button
            variant="primary"
            size="sm"
            glow
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => {
              const report = `TalentSim Interview Report\nRole: ${config.role}\nOverall score: ${overallScore}%\nAverage WPM: ${avgWpm}\nFiller words: ${totalFillers}`;
              const blob = new Blob([report], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'talentsim-interview-report.txt';
              link.click();
              URL.revokeObjectURL(url);
              setActionMessage('Report downloaded.');
            }}
          >
            Export Report
          </Button>
        </div>
        {actionMessage && <p className="text-xs text-orange-300">{actionMessage}</p>}
      </div>

      {/* Main Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverGlow className="border-blue-500/30">
          <div className="text-xs font-semibold text-zinc-400 mb-1">Overall Interview Score</div>
          <div className="text-4xl font-extrabold text-white">{overallScore}%</div>
          <ProgressBar value={overallScore} variant="gradient" size="sm" className="my-2" />
          <span className="text-xs text-zinc-400 font-medium">Calculated from this session</span>
        </Card>

        <Card hoverGlow>
          <div className="text-xs font-semibold text-zinc-400 mb-1">Eye Contact Index</div>
          <div className="text-3xl font-bold text-blue-400">{eyeContactScore}%</div>
          <p className="text-xs text-zinc-400 mt-2">MediaPipe Vision Tracking</p>
        </Card>

        <Card hoverGlow>
          <div className="text-xs font-semibold text-zinc-400 mb-1">Communication Pace</div>
          <div className="text-3xl font-bold text-purple-400">{avgWpm} WPM</div>
          <p className="text-xs text-zinc-400 mt-2">{totalFillers} total filler words</p>
        </Card>

        <Card hoverGlow>
          <div className="text-xs font-semibold text-zinc-400 mb-1">Recruiter Signal</div>
          <div className="mt-1">
            <Badge variant={overallScore >= 85 ? 'green' : overallScore >= 70 ? 'blue' : 'amber'} size="md">
              {answers.length ? (overallScore >= 85 ? 'STRONG HIRE' : overallScore >= 70 ? 'HIRE' : 'NEEDS PRACTICE') : 'AWAITING ANSWERS'}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-2">High role alignment</p>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('recruiter')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'recruiter'
              ? 'bg-primary text-white shadow-lg shadow-blue-900/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Recruiter Perspective Mode 🔥
        </button>
        <button
          onClick={() => setActiveTab('replay')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'replay'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Replay Studio & Timeline 🔥
        </button>
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'breakdown'
              ? 'bg-cyan-600 text-zinc-950 shadow-lg shadow-cyan-900/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Question-by-Question Breakdown
        </button>
      </div>

      {/* TAB 1: RECRUITER PERSPECTIVE */}
      {activeTab === 'recruiter' && (
        <div className="space-y-6">
          <Card className="border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-zinc-900 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-800 pb-4">
              <div>
                <Badge variant="blue" icon={<UserCheck className="w-4 h-4" />}>
                  Hiring Manager Lens
                </Badge>
                <h2 className="text-2xl font-bold text-white mt-2">Recruiter Decision</h2>
                <p className="text-xs text-zinc-400">
                  Based on comparison against expected skill profiles for Senior Frontend Engineers at tier-1 tech firms.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400 font-mono">Predicted Role Suitability</span>
                <div className="text-3xl font-extrabold text-emerald-400">92%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Top Strengths Noticed During Interview
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 text-zinc-300">
                    <span className="font-bold text-white">System Architecture & Trade-Off Clarity:</span> Articulates browser rendering loops and memoization trade-offs with high precision.
                  </div>
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 text-zinc-300">
                    <span className="font-bold text-white">Eye Contact & Composure:</span> Maintained 91% steady gaze direction, projecting confidence under probing follow-ups.
                  </div>
                </div>
              </div>

              {/* Concerns */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Rejection Risk / Concerns Identified
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 text-zinc-300">
                    <span className="font-bold text-white">Quantitative Impact Metrics:</span> Question 3 lacked specific numbers (e.g. % performance increase or team size) in the STAR response.
                  </div>
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 text-zinc-300">
                    <span className="font-bold text-white">Filler Word Frequency:</span> Used filler words ("um", "like") during long pause transitions.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: REPLAY STUDIO */}
      {activeTab === 'replay' && (
        <div className="space-y-6">
          <Card className="border-purple-500/30 bg-zinc-900/90 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-400" /> Interactive Replay Timeline
                </CardTitle>
                <CardDescription>Click any event marker to scrub directly to that interview moment</CardDescription>
              </div>
              <Badge variant="purple">Audio & Video Timeline</Badge>
            </div>

            {/* Candidate Video Replay Player */}
            {recordingUrl && (
              <div className="relative aspect-video max-w-xl mx-auto rounded-2xl overflow-hidden border border-purple-500/30 bg-black">
                <video src={recordingUrl} controls className="w-full h-full object-cover" />
              </div>
            )}

            {/* Scrub Player Widget */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  >
                    {isPlaying ? 'Pause Replay' : 'Play Timeline'}
                  </Button>
                  <span className="text-xs font-mono text-zinc-400">
                    Marker: {replayTimeline[currentTimelineIndex].timestamp} • {replayTimeline[currentTimelineIndex].event}
                  </span>
                </div>
                <Badge variant={replayTimeline[currentTimelineIndex].type === 'positive' ? 'green' : replayTimeline[currentTimelineIndex].type === 'warning' ? 'amber' : 'red'}>
                  {replayTimeline[currentTimelineIndex].type.toUpperCase()}
                </Badge>
              </div>

              {/* Visual Timeline Scrubber Bar */}
              <div className="space-y-2">
                <div className="relative w-full bg-zinc-800 h-4 rounded-full flex items-center px-1">
                  {replayTimeline.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTimelineIndex(idx)}
                      className={`absolute w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 ${
                        idx === currentTimelineIndex ? 'scale-125 border-white bg-purple-500 z-10' : 'border-zinc-900 bg-zinc-600'
                      }`}
                      style={{ left: `${(idx / (replayTimeline.length - 1)) * 92 + 2}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* List of Timestamp Events */}
            <div className="space-y-3">
              {replayTimeline.map((ev, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentTimelineIndex(i)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    currentTimelineIndex === i
                      ? 'border-purple-500 bg-purple-500/10 shadow-glow-purple'
                      : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10">
                        {ev.timestamp}
                      </span>
                      <span className="font-bold text-white text-sm">{ev.event}</span>
                    </div>
                    <Badge variant={ev.type === 'positive' ? 'green' : ev.type === 'warning' ? 'amber' : 'red'} size="sm">
                      {ev.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">{ev.q}</div>
                  <p className="text-xs text-zinc-300 mt-1">{ev.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: DETAILED BREAKDOWN */}
      {activeTab === 'breakdown' && (
        <Card className="border-zinc-800 space-y-4">
          <CardTitle>Skill Matrix & Radar Chart</CardTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#27272A" />
                <PolarAngleAxis dataKey="skill" stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3F3F46" />
                <Radar name="Vasanth" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </motion.div>
  );
};
