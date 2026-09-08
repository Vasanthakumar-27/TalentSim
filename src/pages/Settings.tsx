import React, { useState } from 'react';
import { Card, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Bot,
  Video,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState('Sarah (Professional Lead)');
  const [videoQuality, setVideoQuality] = useState('1080p HD (High Accuracy)');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('talentsim-settings', JSON.stringify({ voice: selectedVoice, videoQuality }));
    setSaved(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Configure AI interviewer preferences, computer vision, and app theme.</p>
      </div>

      {/* AI Voice & Persona */}
      <Card className="border-zinc-800 space-y-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-orange-400" /> Default AI Interviewer Voice Persona
        </CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['Sarah (Professional Lead)', 'Alex (Friendly Senior)', 'Marcus (Strict Director)'].map((voice) => (
            <div
              key={voice}
              onClick={() => setSelectedVoice(voice)}
              className={`p-4 rounded-xl border cursor-pointer text-xs font-semibold ${
                selectedVoice === voice
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {voice}
            </div>
          ))}
        </div>
      </Card>

      {/* Video & Computer Vision */}
      <Card className="border-zinc-800 space-y-4">
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-amber-400" /> Computer Vision Resolution
        </CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['1080p HD (High Accuracy)', '720p Balanced (Lower Bandwidth)'].map((res) => (
            <div
              key={res}
              onClick={() => setVideoQuality(res)}
              className={`p-4 rounded-xl border cursor-pointer text-xs font-semibold ${
                videoQuality === res
                  ? 'border-orange-500 bg-orange-500/10 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {res}
            </div>
          ))}
        </div>
      </Card>

      <Button variant="primary" size="md" glow onClick={handleSave}>
        {saved ? 'Settings Saved' : 'Save Settings'}
      </Button>
    </div>
  );
};
