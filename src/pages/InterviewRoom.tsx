import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Logo } from '../components/ui/Logo';
import { useMediaStream } from '../hooks/useMediaStream';
import { useAudioLevel } from '../hooks/useAudioLevel';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useFaceTracking } from '../hooks/useFaceTracking';
import { useRecorder } from '../hooks/useRecorder';
import { interviewsApi } from '../services/api';
import { useInterviewStore } from '../store/interviewStore';
import { getQuestionsForCompany } from '../data/companyQuestions';
import {
  Mic,
  MicOff,
  VideoOff,
  Video,
  Eye,
  Brain,
  Bot,
  Square,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  RefreshCw,
  Volume2,
  Camera,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// ─── Media Permission Gate ────────────────────────────────────────────────────
const PermissionGate: React.FC<{
  cameraEnabled: boolean;
  micEnabled: boolean;
  streamLoading: boolean;
  streamError: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onEnterRoom: () => void;
}> = ({ cameraEnabled, micEnabled, streamLoading, streamError, videoRef, onEnterRoom }) => {
  const cameraOk = cameraEnabled && !streamError;
  const micOk = micEnabled && !streamError;
  const canProceed = cameraOk && micOk;

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-4">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="neural-orb-1 top-[-100px] left-[-100px]" />
        <div className="neural-orb-2 bottom-[-80px] right-[-80px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-white">Interview Room Setup</h1>
          <p className="text-sm text-[#94A3B8]">
            Please allow camera and microphone access to start your session.
          </p>
        </div>

        {/* Camera + Mic Permission Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Camera Card */}
          <div
            className={`glass-card rounded-2xl p-5 border ${
              streamError
                ? 'border-rose-500/40 bg-rose-950/20'
                : cameraOk
                ? 'border-[#22C55E]/40 bg-emerald-950/20'
                : 'border-[#263248]'
            } transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  streamError
                    ? 'bg-rose-500/20 text-rose-400'
                    : cameraOk
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-[#5B5FEF]/20 text-[#5B5FEF]'
                }`}
              >
                {streamLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : streamError ? (
                  <AlertCircle className="w-5 h-5" />
                ) : cameraOk ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Camera</div>
                <div
                  className={`text-xs ${
                    streamError
                      ? 'text-rose-400'
                      : cameraOk
                      ? 'text-emerald-400'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {streamLoading
                    ? 'Requesting access...'
                    : streamError === 'permission_denied'
                    ? 'Permission denied'
                    : streamError === 'not_found'
                    ? 'No camera found'
                    : cameraOk
                    ? 'Connected & active'
                    : 'Waiting for permission'}
                </div>
              </div>
            </div>

            {/* Live camera preview */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
              <video
                ref={videoRef}
                muted
                playsInline
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  cameraOk ? 'block' : 'hidden'
                }`}
              />
              {!cameraOk && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-[#4A5568]" />
                </div>
              )}
              {cameraOk && (
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1.5 bg-black/70 text-emerald-400 text-[10px] font-semibold px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Microphone Card */}
          <div
            className={`glass-card rounded-2xl p-5 border ${
              streamError
                ? 'border-rose-500/40 bg-rose-950/20'
                : micOk
                ? 'border-[#22C55E]/40 bg-emerald-950/20'
                : 'border-[#263248]'
            } transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  streamError
                    ? 'bg-rose-500/20 text-rose-400'
                    : micOk
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-[#5B5FEF]/20 text-[#5B5FEF]'
                }`}
              >
                {streamLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : streamError ? (
                  <AlertCircle className="w-5 h-5" />
                ) : micOk ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Microphone</div>
                <div
                  className={`text-xs ${
                    streamError ? 'text-rose-400' : micOk ? 'text-emerald-400' : 'text-[#94A3B8]'
                  }`}
                >
                  {streamLoading
                    ? 'Requesting access...'
                    : streamError === 'permission_denied'
                    ? 'Permission denied'
                    : streamError === 'not_found'
                    ? 'No microphone found'
                    : micOk
                    ? 'Active & ready'
                    : 'Waiting for permission'}
                </div>
              </div>
            </div>

            {/* Mic visual feedback */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
              {micOk ? (
                <div className="text-center space-y-4">
                  <div className="flex items-end justify-center gap-1 h-12">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="audio-bar"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-[#22C55E] text-xs font-semibold">Microphone active</p>
                </div>
              ) : (
                <MicOff className="w-8 h-8 text-[#4A5568]" />
              )}
            </div>
          </div>
        </div>

        {/* Permission error helper */}
        {streamError === 'permission_denied' && (
          <div className="flex items-start gap-3 bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div className="text-[#94A3B8]">
              Camera/mic access was denied. Click the <strong className="text-white">lock icon</strong> in your browser address bar, set Camera & Microphone to <strong className="text-white">Allow</strong>, then refresh the page.
            </div>
          </div>
        )}

        {/* Checklist */}
        <div className="glass-panel rounded-2xl p-4 border border-[#263248]">
          <div className="text-xs font-semibold text-[#94A3B8] mb-3 uppercase tracking-wider">Pre-Interview Checklist</div>
          <div className="space-y-2">
            {[
              { label: 'Camera access granted', ok: cameraOk },
              { label: 'Microphone access granted', ok: micOk },
              { label: 'Quiet environment recommended', ok: true },
              { label: 'Good lighting on face', ok: cameraOk },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-xs">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    item.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#263248] text-[#4A5568]'
                  }`}
                >
                  {item.ok ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>
                <span className={item.ok ? 'text-[#F8FAFC]' : 'text-[#4A5568]'}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enter Room CTA */}
        <button
          onClick={onEnterRoom}
          disabled={!canProceed}
          className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            canProceed
              ? 'bg-gradient-to-r from-[#5B5FEF] to-[#9D4EDD] text-white hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-[#5B5FEF]/30'
              : 'bg-[#131B2E] text-[#4A5568] cursor-not-allowed border border-[#263248]'
          }`}
        >
          {streamLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up devices...
            </>
          ) : canProceed ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              Enter Interview Room
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              Camera & Microphone required
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Main Interview Room ──────────────────────────────────────────────────────
export const InterviewRoom: React.FC = () => {
  const navigate = useNavigate();
  const [roomReady, setRoomReady] = useState(false);

  // Custom Hooks
  const {
    videoRef,
    stream,
    isLoading: streamLoading,
    error: streamError,
    cameraEnabled,
    micEnabled,
    toggleCamera,
    toggleMic,
  } = useMediaStream();

  const { audioLevel, startAnalysis, stopAnalysis } = useAudioLevel();

  const {
    eyeContactScore,
    faceDetected,
    headPosture,
  } = useFaceTracking(videoRef, cameraEnabled && roomReady);

  const {
    interimTranscript,
    finalTranscript,
    wpm,
    fillers,
    pauseCount,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();
  const { startRecording, stopRecording } = useRecorder();

  // Zustand Store State
  const {
    config,
    questions,
    currentQuestionIndex,
    sessionState,
    setSessionState,
    addQuestion,
    commitAnswer,
    startSession,
    setSessionId,
    setEyeContactScore,
    setRecordingUrl,
  } = useInterviewStore();

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [answerError, setAnswerError] = useState('');
  const answerStartedAt = React.useRef<number | null>(null);

  const staticQuestions = React.useMemo(
    () => [
      'Tell me about your experience optimizing React application rendering performance. What bottlenecks did you run into?',
      'Explain how you handle asynchronous state and error boundaries in large TypeScript frontends.',
      'Describe a situation where you had a strong technical disagreement with a team member. How did you reach consensus?',
    ],
    []
  );

  // Initialize Session
  useEffect(() => {
    startSession();
    const companyQs = getQuestionsForCompany(config.company || 'Google');
    if (companyQs && companyQs.length > 0) {
      companyQs.forEach((cq) => addQuestion(cq.text));
    } else {
      staticQuestions.forEach((q) => addQuestion(q));
    }
  }, [addQuestion, config.company, startSession, staticQuestions]);

  useEffect(() => {
    let cancelled = false;
    const createRemoteSession = async () => {
      try {
        const session = await interviewsApi.create({
          role: config.role,
          company: config.company,
          interviewType: config.interviewType,
          difficulty: config.difficulty,
        });
        if (!cancelled) setSessionId(session.id);
      } catch {
        if (!cancelled) setAnswerError('Could not connect to the interview service. Your local session is still available.');
      }
    };
    void createRemoteSession();
    return () => { cancelled = true; };
  }, [config.company, config.difficulty, config.interviewType, config.role, setSessionId]);

  // Sync Audio Level Analyzer with Media Stream
  useEffect(() => {
    if (stream && micEnabled) {
      startAnalysis(stream);
    } else {
      stopAnalysis();
    }
  }, [stream, micEnabled, startAnalysis, stopAnalysis]);

  useEffect(() => {
    setEyeContactScore(eyeContactScore);
  }, [eyeContactScore, setEyeContactScore]);

  // Auto-read question aloud when room is ready
  const currentQ = questions[currentQuestionIndex] || staticQuestions[currentQuestionIndex];
  useEffect(() => {
    if (!roomReady) return;
    if (currentQ && (sessionState === 'QUESTION' || sessionState === 'FOLLOW_UP')) {
      speak(currentQ);
    }
    return () => stopSpeaking();
  }, [currentQ, sessionState, roomReady, speak, stopSpeaking]);

  // Session timer (only runs once in room)
  useEffect(() => {
    if (!roomReady) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [roomReady]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartAnswering = () => {
    setAnswerError('');
    stopSpeaking();
    resetTranscript();
    answerStartedAt.current = Date.now();
    setSessionState('LISTENING');
    startListening();
    if (stream) {
      startRecording(stream);
    }
  };

  const handleFinishAnswer = async () => {
    const transcript = finalTranscript.trim() || interimTranscript.trim();
    if (!transcript) {
      setAnswerError('No spoken answer was captured. Please answer the question before submitting.');
      return;
    }

    stopListening();
    setSessionState('PROCESSING');

    const videoUrl = await stopRecording();
    if (videoUrl) {
      setRecordingUrl(videoUrl);
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - (answerStartedAt.current || Date.now())) / 1000));
    const answer = {
      questionText: currentQ,
      questionType: config.interviewType,
      transcript,
      wpm,
      fillerCount: fillers.count,
      pauseCount,
      durationSeconds,
    };

    try {
      const remoteSessionId = useInterviewStore.getState().sessionId;
      if (remoteSessionId && !remoteSessionId.startsWith('session_')) {
        await interviewsApi.addAnswer(remoteSessionId, {
          questionText: answer.questionText,
          transcript: answer.transcript,
          wpm: answer.wpm,
          fillerCount: answer.fillerCount,
          pauseCount: answer.pauseCount,
          durationSeconds: answer.durationSeconds,
        });
      }
      commitAnswer({
        questionText: answer.questionText,
        questionType: answer.questionType,
        transcript: answer.transcript,
        wpm: answer.wpm,
        fillerCount: answer.fillerCount,
        pauseCount: answer.pauseCount,
        durationSeconds: answer.durationSeconds,
      });
      setSessionState('FOLLOW_UP');
    } catch {
      setSessionState('LISTENING');
      setAnswerError('Your answer could not be saved. Check your connection and try again.');
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setSessionState('QUESTION');
      useInterviewStore.setState((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
      }));
    } else {
      const remoteSessionId = useInterviewStore.getState().sessionId;
      if (remoteSessionId && !remoteSessionId.startsWith('session_')) {
        await interviewsApi.complete(remoteSessionId);
      }
      navigate('/interview/report');
    }
  };

  // ── Show Permission Gate First ─────────────────────────────────────────────
  if (!roomReady) {
    return (
      <PermissionGate
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        streamLoading={streamLoading}
        streamError={streamError}
        videoRef={videoRef}
        onEnterRoom={() => setRoomReady(true)}
      />
    );
  }

  // ── Interview Room ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#F8FAFC] flex flex-col justify-between p-4 space-y-4">
      {/* Top Navigation Bar */}
      <header className="glass-panel border border-[#263248] rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-5 w-px bg-[#263248] hidden sm:block" />
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Technical Interview Room{' '}
              <Badge variant="purple" size="sm">
                {config.role}
              </Badge>
            </div>
            <div className="text-xs text-[#94A3B8]">Target: {config.company} Standards</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131B2E] border border-[#263248] text-xs font-mono font-bold text-white">
            <Clock className="w-4 h-4 text-[#1ED6FF] animate-pulse" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/interview/report')}
            leftIcon={<Square className="w-3.5 h-3.5 fill-white" />}
          >
            End Interview
          </Button>
        </div>
      </header>

      {/* Central Viewport Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Left: AI Interviewer */}
        <div className="lg:col-span-2 relative bg-[#131B2E] rounded-2xl overflow-hidden border border-[#263248] p-6 flex flex-col justify-between">
          {/* AI Header */}
          <div className="flex justify-between items-start z-10">
            <Badge variant="blue" icon={<Bot className="w-3.5 h-3.5" />}>
              AI Interviewer: Sarah ({config.personality})
            </Badge>

            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-[#94A3B8] border border-[#263248]">
              {isSpeaking ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#1ED6FF] animate-pulse" />
                  <span className="text-[#1ED6FF] font-bold">AI Speaking</span>
                </>
              ) : sessionState === 'LISTENING' ? (
                <span className="text-[#22C55E] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" /> Listening...
                </span>
              ) : (
                <span className="text-[#F59E0B] font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                </span>
              )}
            </div>
          </div>

          {/* AI Avatar + Question */}
          <div className="my-auto text-center space-y-6 max-w-2xl mx-auto py-8">
            <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-[#5B5FEF] via-[#9D4EDD] to-[#1ED6FF] p-1.5">
              <div className="w-full h-full rounded-full bg-[#0A0F1C] flex items-center justify-center">
                <Bot
                  className={`w-14 h-14 text-[#1ED6FF] ${isSpeaking ? 'animate-bounce' : ''}`}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#22C55E] border-2 border-[#0A0F1C] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9D4EDD]">
                Question {currentQuestionIndex + 1} of {questions.length || 3}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                "{currentQ}"
              </h2>
            </div>
          </div>

          {/* Live Transcript Box */}
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-[#263248] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#1ED6FF] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Speech-to-Text Live Transcript
              </span>
              <span className="text-[#94A3B8] font-mono">
                {wpm} WPM • Fillers: {fillers.count}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono leading-relaxed min-h-[3rem]">
              {sessionState === 'LISTENING'
                ? finalTranscript || interimTranscript || 'Listening to your response...'
                : sessionState === 'PROCESSING'
                ? 'Processing response parameters, STAR alignment, and filler frequency...'
                : 'Click "Start Answering Response" below to respond via microphone.'}
            </p>
            {answerError && <p className="text-xs text-rose-400">{answerError}</p>}
          </div>
        </div>

        {/* Right: Analytics + Camera */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Webcam Preview */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-[#263248] flex items-center justify-center">
            <video
              ref={videoRef}
              muted
              playsInline
              className={`w-full h-full object-cover transform -scale-x-100 ${
                !cameraEnabled ? 'hidden' : 'block'
              }`}
            />
            {!cameraEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#131B2E] text-[#4A5568] text-xs gap-2">
                <VideoOff className="w-6 h-6" />
                Camera Disabled
              </div>
            )}

            {/* Face tracking overlay */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-full text-[10px] text-[#94A3B8] font-mono border border-[#263248]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  faceDetected ? 'bg-[#22C55E] animate-pulse' : 'bg-rose-500'
                }`}
              />
              {faceDetected ? `Posture: ${headPosture}` : 'No Face Detected'}
            </div>

            {/* Cam / Mic toggle overlays */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              <button
                onClick={toggleCamera}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  cameraEnabled
                    ? 'bg-[#5B5FEF]/80 text-white'
                    : 'bg-rose-600/80 text-white'
                }`}
                title={cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
              >
                {cameraEnabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleMic}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  micEnabled
                    ? 'bg-[#5B5FEF]/80 text-white'
                    : 'bg-rose-600/80 text-white'
                }`}
                title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Audio level bar */}
            {micEnabled && (
              <div className="absolute bottom-2 left-2 flex items-end gap-0.5 h-6">
                {[...Array(5)].map((_, i) => {
                  const active = audioLevel > i * 20;
                  return (
                    <div
                      key={i}
                      className="w-1 rounded-sm transition-all duration-75"
                      style={{
                        height: `${Math.max(20, Math.min(100, (i + 1) * 20))}%`,
                        backgroundColor: active ? '#22c55e' : '#263248',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Analytics */}
          <Card className="bg-[#131B2E] border-[#263248] p-4 space-y-3 flex-1">
            <div className="flex justify-between items-center text-xs font-semibold text-[#94A3B8]">
              <span>Live Behavioral Metrics</span>
              <Badge variant="green">Active</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8] flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#5B5FEF]" /> Eye Contact
                  </span>
                  <span className="text-[#5B5FEF] font-mono font-bold">{eyeContactScore}%</span>
                </div>
                <div className="w-full bg-[#263248] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5B5FEF] h-full transition-all duration-300"
                    style={{ width: `${eyeContactScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#94A3B8] flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-[#9D4EDD]" /> Head Posture
                  </span>
                  <span className="text-[#9D4EDD] font-mono font-bold">{headPosture}</span>
                </div>
                <div className="w-full bg-[#263248] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#9D4EDD] h-full transition-all duration-300"
                    style={{
                      width: `${
                        headPosture === 'Centered' ? 95 : headPosture === 'Tilted' ? 75 : 40
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-[#0A0F1C] rounded-xl border border-[#263248]">
                <span className="text-[#94A3B8]">Filler Words</span>
                <span className="text-[#F59E0B] font-mono font-bold">{fillers.count} total</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-[#0A0F1C] rounded-xl border border-[#263248]">
                <span className="text-[#94A3B8]">Speech Speed</span>
                <span className="text-[#1ED6FF] font-mono font-bold">{wpm} WPM</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Control Deck */}
      <div className="glass-panel border border-[#263248] rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Hardware status indicators */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
              micEnabled
                ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {micEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            {micEnabled ? 'Mic On' : 'Mic Off'}
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
              cameraEnabled
                ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {cameraEnabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            {cameraEnabled ? 'Cam On' : 'Cam Off'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {sessionState === 'QUESTION' && (
            <Button
              variant="primary"
              size="md"
              glow
              onClick={handleStartAnswering}
              leftIcon={<Mic className="w-4 h-4" />}
            >
              Start Answering Response
            </Button>
          )}

          {sessionState === 'LISTENING' && (
            <Button
              variant="secondary"
              size="md"
              onClick={handleFinishAnswer}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              I Have Conveyed My Answer
            </Button>
          )}

          {sessionState === 'PROCESSING' && (
            <Button variant="outline" size="md" isLoading>
              AI Evaluating Speech...
            </Button>
          )}

          {sessionState === 'FOLLOW_UP' && (
            <Button
              variant="accent"
              size="md"
              onClick={handleNextQuestion}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
