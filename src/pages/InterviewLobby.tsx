import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Camera,
  Mic,
  FileText,
  Bot,
  CheckCircle2,
  Play,
  Sparkles,
} from 'lucide-react';

export const InterviewLobby: React.FC = () => {
  const navigate = useNavigate();
  const [aiInitialized, setAiInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAiInitialized(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" /> INTERVIEW ROOM LOBBY
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          System Readiness & Hardware Pre-Check
        </h1>
        <p className="text-sm text-zinc-400">
          Verify video feed, audio input, and AI question engine before entering the room.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Camera Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-center p-6 group">
            {/* Camera Overlay Graphic */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

            {/* Facial Bounding box simulation */}
            <div className="w-48 h-56 border-2 border-cyan-400/60 rounded-3xl relative z-20 flex flex-col justify-between p-2 animate-pulse-slow">
              <div className="flex justify-between text-[10px] font-mono text-cyan-400 bg-black/60 px-1.5 py-0.5 rounded">
                <span>FACIAL_ALIGNMENT</span>
                <span>98.4%</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded text-center">
                EYE_CONTACT: CENTERED
              </div>
            </div>

            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
              <Badge variant="green" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Camera Active (HD 1080p)
              </Badge>
            </div>
          </div>

          {/* Mic Visualizer */}
          <Card className="border-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Microphone Input Level</div>
                <div className="text-xs text-zinc-400">Default Input Microphone</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
              <span className="text-xs text-emerald-400 font-mono font-bold ml-2">Receiving Audio</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Pre-Check List */}
        <div className="space-y-6 flex flex-col justify-between">
          <Card className="space-y-4 border-zinc-800">
            <CardTitle>Session Checklist</CardTitle>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="flex items-center gap-2 text-zinc-300">
                  <Camera className="w-4 h-4 text-blue-400" /> Camera Video Stream
                </span>
                <Badge variant="green">Ready</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="flex items-center gap-2 text-zinc-300">
                  <Mic className="w-4 h-4 text-purple-400" /> Audio STT Input
                </span>
                <Badge variant="green">Ready</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="flex items-center gap-2 text-zinc-300">
                  <FileText className="w-4 h-4 text-cyan-400" /> Resume Context
                </span>
                <Badge variant="blue">Vasanth.pdf</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="flex items-center gap-2 text-zinc-300">
                  <Bot className="w-4 h-4 text-emerald-400" /> AI Persona Engine
                </span>
                {aiInitialized ? (
                  <Badge variant="green">Initialized</Badge>
                ) : (
                  <Badge variant="amber">Loading...</Badge>
                )}
              </div>
            </div>
          </Card>

          <Button
            variant="primary"
            size="lg"
            glow
            onClick={() => navigate('/interview/room')}
            isLoading={!aiInitialized}
            className="w-full justify-center py-4"
            leftIcon={<Play className="w-5 h-5 fill-white" />}
          >
            Enter Interview Room
          </Button>
        </div>
      </div>
    </div>
  );
};
