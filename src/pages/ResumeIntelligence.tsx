import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { extractTextFromPDF, parseResumeSkills, type ParsedResume } from '../services/resumeParser';
import { storageApi } from '../services/api';
import { useInterviewStore } from '../store/interviewStore';
import {
  Upload,
  FileText,
  Sparkles,
  Code,
  Briefcase,
  HelpCircle,
  Play,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const ResumeIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { setConfig, addQuestion } = useInterviewStore();

  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('No resume uploaded');
  const [uploadMessage, setUploadMessage] = useState('');
  const [parsedData, setParsedData] = useState<ParsedResume>({
    rawText: '',
    skills: [],
    suggestedRole: 'Upload a resume to detect a role',
    strengthScore: 0,
    extractedProjects: [],
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadMessage('');
      setFileName(file.name);

      try {
        await storageApi.uploadResume(file);
        setUploadMessage('Resume uploaded securely.');
      } catch {
        setUploadMessage('Resume parsed locally, but cloud upload failed.');
      }

      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      const parsed = parseResumeSkills(text);
      setParsedData(parsed);

      // Save suggested role and skills into interview store
      setConfig({
        role: parsed.suggestedRole,
      });

      // Generate custom questions targeting candidate's skills
      parsed.skills.forEach((skill) => {
        addQuestion(`Tell me about a complex challenge you solved using ${skill} and how you evaluated its performance.`);
      });
    } catch {
      // Fallback
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartTargetedInterview = () => {
    navigate('/interview/room');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" /> TALENTSIM RESUME ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Resume Intelligence & Q&A Generator
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Extract skills, parse experience, and generate role-specific interview questions automatically.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          isLoading={isUploading}
          leftIcon={<RefreshCw className="w-4 h-4 text-cyan-400" />}
        >
          Re-Analyze Resume
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload Dropzone & Score */}
        <div className="space-y-6">
          {/* Dropzone Card */}
          <Card
            className="border-dashed border-2 border-zinc-700 hover:border-primary/50 text-center p-8 transition-colors space-y-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-primary">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Your Resume</h3>
              <p className="text-xs text-zinc-400 mt-1">Supports PDF, TXT (Max 10MB)</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono text-zinc-200 truncate">{fileName}</span>
              </div>
              <Badge variant={fileName === 'No resume uploaded' ? 'amber' : 'green'} size="sm">
                {fileName === 'No resume uploaded' ? 'Waiting' : 'Loaded'}
              </Badge>
            </div>
            {uploadMessage && <p className="text-xs text-zinc-400">{uploadMessage}</p>}
            <Button variant="primary" size="sm" className="w-full justify-center" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} isLoading={isUploading}>
              Choose PDF File
            </Button>
          </Card>

          {/* Resume Impact Score */}
          <Card className="glass-card border-blue-500/30 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-400">Resume Impact Score</span>
              <Badge variant="purple">Parsed</Badge>
            </div>
            <div className="text-4xl font-extrabold text-white">{parsedData.strengthScore}%</div>
            <ProgressBar value={parsedData.strengthScore} variant="gradient" size="md" />
            <p className="text-xs text-zinc-300">
              Target role detected: <span className="text-cyan-400 font-bold">{parsedData.suggestedRole}</span>
            </p>

            <Button
              variant="accent"
              size="md"
              glow
              className="w-full justify-center mt-3"
              onClick={handleStartTargetedInterview}
              rightIcon={<Play className="w-4 h-4" />}
            >
              Start Targeted Interview
            </Button>
          </Card>
        </div>

        {/* Right Column: Parsed Intelligence Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Extracted Skill Stack */}
          <Card className="space-y-4 border-zinc-800">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" /> Detected Technical Skills ({parsedData.skills.length})
              </CardTitle>
              <Badge variant="blue">Automated PDF Parsing</Badge>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {parsedData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Extracted Projects */}
          <Card className="space-y-4 border-zinc-800">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" /> Key Projects Identified
            </CardTitle>
            <div className="space-y-3">
              {parsedData.extractedProjects.map((projTitle: string, idx: number) => (
                <div key={idx} className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1.5">
                  <div className="text-sm font-bold text-white">{projTitle}</div>
                  <div className="text-xs text-cyan-400 font-mono">Parsed from uploaded resume</div>
                  <p className="text-xs text-zinc-300">Technical depth and architectural trade-offs will be probed during interview.</p>
                </div>
              ))}
            </div>
          </Card>

          {/* AI-Generated Resume Custom Questions */}
          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-zinc-900 to-zinc-950 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" /> Auto-Generated Resume Questions
                </CardTitle>
                <CardDescription>Tailored questions interviewers will likely ask based on your uploaded resume</CardDescription>
              </div>
              <Badge variant="cyan">AI Generator</Badge>
            </div>

            <div className="space-y-3">
              {parsedData.skills.slice(0, 3).map((skill: string, idx: number) => (
                <div key={idx} className="p-4 bg-zinc-900/90 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" size="sm">Technical Depth</Badge>
                      <Badge variant="amber" size="sm">Hard</Badge>
                    </div>
                    <p className="text-sm font-medium text-white">
                      "Tell me about a complex challenge you solved using {skill} and how you evaluated performance trade-offs."
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={handleStartTargetedInterview}
                    leftIcon={<Play className="w-3.5 h-3.5 text-primary" />}
                  >
                    Practice This Q
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
