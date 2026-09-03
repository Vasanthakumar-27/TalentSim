import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';


import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Logo } from '../components/ui/Logo';
import {
  Play,
  Sparkles,
  Bot,
  Video,
  Eye,
  Mic,
  Brain,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react';

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};


export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-zinc-100 selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-grid-pattern">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/18 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          {/* Header Pill */}
          <motion.div variants={heroVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-orange-500/30 mb-8 animate-float">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-semibold text-zinc-200">
              Next-Gen AI Interview Simulation Engine
            </span>
            <Badge variant="amber" size="sm">New 2.0</Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={heroVariants} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
            Train Smarter. Get Hired{' '}
            <span className="gradient-text-primary">Faster.</span>
          </motion.h1>


          {/* Subtitle */}
          <motion.p variants={heroVariants} className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Practice realistic interviews with an adaptive AI interviewer that evaluates your{' '}
            <span className="text-zinc-200 font-medium">confidence</span>,{' '}
            <span className="text-zinc-200 font-medium">communication</span>,{' '}
            <span className="text-zinc-200 font-medium">technical depth</span>, and{' '}
            <span className="text-zinc-200 font-medium">body language</span> in real-time.
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={heroVariants} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                glow
                leftIcon={<Play className="w-5 h-5 fill-white" />}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Start Free Interview
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Sparkles className="w-5 h-5 text-orange-400" />}
                className="w-full sm:w-auto"
              >
                Explore TalentSim Tracks
              </Button>
            </Link>
          </motion.div>

          {/* Social Trust Metrics */}
          <motion.div variants={heroVariants} className="mt-12 flex items-center justify-center gap-8 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 10,000+ Mock Interviews Conducted
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" /> Target Roles at Google, Amazon, Zoho
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Interactive Mock Interview Preview Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="rounded-2xl glass-panel p-2 border border-zinc-800 shadow-2xl relative overflow-hidden group">
            {/* Top Bar */}
            <div className="bg-zinc-900/90 rounded-t-xl px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-zinc-300">TalentSim Technical Room • Google Senior Frontend Developer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE ANALYTICS ACTIVE
                </span>
              </div>
            </div>


            {/* Video Room Split Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-zinc-950/80 rounded-b-xl">
              {/* Left AI Interviewer Feed */}
              <div className="lg:col-span-2 relative aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <Badge variant="purple" icon={<Bot className="w-3.5 h-3.5" />}>
                    AI Interviewer: Sarah (Senior Lead)
                  </Badge>
                  <div className="flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full text-xs font-mono text-zinc-300">
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                    <div className="audio-bar" />
                    <span>Speaking...</span>
                  </div>
                </div>

                <div className="my-auto text-center max-w-xl mx-auto space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-300 p-1 animate-pulse-slow">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                      <Bot className="w-10 h-10 text-orange-300" />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-white">
                    "Tell me about a time you optimized rendering performance in a large React application. How did you identify the bottlenecks?"
                  </p>
                </div>

                <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 border border-zinc-800/80 text-xs text-zinc-400">
                  <span className="text-orange-300 font-semibold">Live Speech-to-Text Transcript:</span> "I used React Profiler to trace re-renders and converted context hooks to localized component state..."
                </div>
              </div>

              {/* Right Live Analytics Panel Preview */}
              <div className="space-y-4 flex flex-col justify-between">
                <Card className="bg-zinc-900/90 border-zinc-800 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                    <span>Live Behavioral Indicators</span>
                    <Badge variant="green">Optimal</Badge>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-orange-400" /> Eye Contact
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">91%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full w-[91%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5 text-amber-400" /> Speaking Pace (WPM)
                        </span>
                        <span className="text-amber-300 font-mono font-bold">142 WPM</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[78%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5 text-yellow-300" /> Filler Word Count
                        </span>
                        <span className="text-yellow-300 font-mono font-bold">2 ("um", "like")</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-400 h-full w-[25%]" />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Recruiter Recommendation Snapshot */}
                <Card className="bg-zinc-900/90 border-blue-500/30 p-4 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-zinc-400">Recruiter Perspective</span>
                    <Badge variant="blue">Strong Hire</Badge>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Top Strength Detected</div>
                  <p className="text-xs text-zinc-400">
                    Articulates technical trade-offs with concrete metrics and clearSTAR framework structure.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="purple">Complete Interview Ecosystem</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Real Career Breakthroughs
            </h2>
            <p className="text-zinc-400 text-base">
              Unlike static Q&A tools, TalentSim recreates high-stakes corporate interview dynamics with adaptive AI feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverGlow className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Realistic AI Simulation</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Adaptive follow-up questions tailored to your target company (Google, Amazon, Zoho, Microsoft) and specific resume details.
              </p>
            </Card>

            <Card hoverGlow className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Computer Vision & Voice</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Monitors eye contact direction, posture stability, voice pitch inflection, filler word frequency, and speech pace.
              </p>
            </Card>

            <Card hoverGlow className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Recruiter Perspective Mode</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                See your candidate evaluation through hiring manager eyes with decision ratings: Strong Hire, Hire, Borderline, or No Hire.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* TalentSim Ecosystem Expansion Section */}
      <section className="py-20 bg-background border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              An Ecosystem, Not Just an App
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              TalentSim scales with your career journey across multiple assessment domains.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Interview', badge: 'Active', color: 'blue' },
              { name: 'Coding', badge: 'Available', color: 'purple' },
              { name: 'Aptitude', badge: 'Available', color: 'cyan' },
              { name: 'Group Discussion', badge: 'New', color: 'green' },
              { name: 'Resume AI', badge: 'Active', color: 'blue' },
              { name: 'Hiring Insights', badge: 'Pro', color: 'amber' },
            ].map((module, i) => (
              <Card key={i} className="text-center p-4 space-y-2 border-zinc-800 hover:border-zinc-700">
                <div className="w-8 h-8 mx-auto rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-sm font-semibold text-white">TalentSim {module.name}</div>
                <Badge variant={module.color as any} size="sm">{module.badge}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-zinc-950 border-t border-zinc-800 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Ace Your Next Big Interview?
          </h2>
          <p className="text-zinc-300 text-base max-w-xl mx-auto">
            Get instant feedback on your technical explanations, body language, and confidence score.
          </p>
          <div>
            <Link to="/interview/setup">
              <Button variant="primary" size="lg" glow rightIcon={<ArrowRight className="w-5 h-5" />}>
                Launch Mock Session Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
