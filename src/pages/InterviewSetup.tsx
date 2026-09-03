import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Bot,
} from 'lucide-react';
import { useInterviewStore } from '../store/interviewStore';

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const { setConfig } = useInterviewStore();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedRole, setSelectedRole] = useState('Senior Frontend Developer');
  const [selectedType, setSelectedType] = useState('Technical & System Architecture');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Hard');
  const [selectedPersonality, setSelectedPersonality] = useState('Professional & Probing');
  const [selectedCompany, setSelectedCompany] = useState<'Google' | 'Amazon' | 'Microsoft' | 'Zoho' | 'Meta'>('Google');

  const roles = [
    { title: 'Senior Frontend Developer', cat: 'Engineering', desc: 'React, TypeScript, Web Performance, State Architecture' },
    { title: 'Backend Systems Engineer', cat: 'Engineering', desc: 'Node.js, Go, Distributed Databases, Microservices' },
    { title: 'Data Scientist & AI Specialist', cat: 'Data & AI', desc: 'Python, Machine Learning, Data Models, LLM fine-tuning' },
    { title: 'Fullstack Product Engineer', cat: 'Engineering', desc: 'End-to-End Web Stack, APIs, Database schema & UI' },
    { title: 'Technical Product Manager', cat: 'Product', desc: 'Roadmaps, Trade-offs, Stakeholder Alignment, Metrics' },
  ];

  const types = [
    { title: 'Technical & System Architecture', desc: 'Deep dive into code quality, trade-offs, and algorithm efficiency' },
    { title: 'HR & Behavioral STAR', desc: 'Past experiences, leadership principles, conflict resolution' },
    { title: 'Managerial & Execution', desc: 'Project ownership, team communication, and strategic decisions' },
    { title: 'Coding & Algorithmic Focus', desc: 'Live code review and problem-solving explanation' },
  ];

  const difficulties = [
    { title: 'Easy', desc: 'Baseline entry-level questions' },
    { title: 'Medium', desc: 'Standard mid-level corporate interview' },
    { title: 'Hard', desc: 'Tier-1 Tech company expectations (Recommended)' },
    { title: 'Expert', desc: 'Staff/Principal level deep probing' },
  ];

  const personalities = [
    { title: 'Friendly & Encouraging', desc: 'Provides warm guidance and supportive follow-ups' },
    { title: 'Professional & Probing', desc: 'Standard recruiter posture, analytical and concise' },
    { title: 'Strict & Metric-Focused', desc: 'Demands precise numbers, STAR details, and zero fluff' },
    { title: 'Stress Interviewer', desc: 'Pushes follow-ups rapidly to test composure under pressure' },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setConfig({

        role: selectedRole,
        interviewType: selectedType,
        difficulty: selectedDifficulty,
        personality: selectedPersonality,
        company: selectedCompany,
      });
      navigate('/interview/lobby');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
          <Sparkles className="w-3.5 h-3.5" /> STEP {currentStep} OF 5
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Configure Your AI Interview Simulation
        </h1>
        <p className="text-sm text-zinc-400">
          Customize the job role, interviewer demeanor, and difficulty level.
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between gap-2 max-w-xl mx-auto">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full h-2 rounded-full transition-all duration-300 ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : 'bg-zinc-800'
              }`}
            />
            <span className={`text-[10px] font-semibold ${step === currentStep ? 'text-white' : 'text-zinc-500'}`}>
              Step {step}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content Container */}
      <Card className="p-8 border-zinc-800 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Step 1: Role */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <CardTitle>Step 1: Select Your Target Job Role</CardTitle>
                  <CardDescription>Questions will be customized based on your selected role and uploaded resume</CardDescription>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRole(r.title)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === r.title
                      ? 'border-primary bg-primary/10 shadow-glow-primary'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">{r.title}</span>
                    <Badge variant="blue" size="sm">{r.cat}</Badge>
                  </div>
                  <p className="text-xs text-zinc-400">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Interview Type */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <CardTitle>Step 2: Choose Interview Category</CardTitle>
              <CardDescription>Select the core evaluation format for this session</CardDescription>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {types.map((t, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedType(t.title)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedType === t.title
                      ? 'border-purple-500 bg-purple-500/10 shadow-glow-purple'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white text-sm mb-1">{t.title}</div>
                  <p className="text-xs text-zinc-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Difficulty */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <CardTitle>Step 3: Set Simulation Difficulty</CardTitle>
              <CardDescription>Higher difficulty introduces complex follow-up challenges</CardDescription>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {difficulties.map((d, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDifficulty(d.title)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDifficulty === d.title
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-glow-cyan'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white text-sm mb-1">{d.title}</div>
                  <p className="text-xs text-zinc-400">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Personality */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <CardTitle>Step 4: AI Interviewer Persona</CardTitle>
              <CardDescription>Recreate the tone and pressure of real interviewers</CardDescription>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personalities.map((p, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPersonality(p.title)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPersonality === p.title
                      ? 'border-blue-500 bg-blue-500/10 shadow-glow-primary'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" /> {p.title}
                  </div>
                  <p className="text-xs text-zinc-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Summary & Target Company */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <CardTitle>Step 5: Select Target Company & Confirm</CardTitle>
              <CardDescription>Choose the tech company style to mirror authentic question standards</CardDescription>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(['Google', 'Amazon', 'Microsoft', 'Zoho', 'Meta'] as const).map((comp) => (
                <div
                  key={comp}
                  onClick={() => setSelectedCompany(comp)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    selectedCompany === comp
                      ? 'border-purple-500 bg-purple-500/10 shadow-glow-purple'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white text-sm">{comp}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Question Bank</div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900/90 rounded-2xl p-6 border border-zinc-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500 text-xs">Target Role</span>
                  <div className="font-bold text-white">{selectedRole}</div>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs">Target Company</span>
                  <div className="font-bold text-purple-400">{selectedCompany}</div>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs">Difficulty</span>
                  <div className="font-bold text-cyan-400">{selectedDifficulty}</div>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs">Persona</span>
                  <div className="font-bold text-emerald-400">{selectedPersonality}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Camera & Mic Pre-Checks Ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resume Vasanth_Resume.pdf Loaded</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>


        {/* Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            size="md"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            size="md"
            glow
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {currentStep === 5 ? 'Enter Interview Lobby' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
