import { create } from 'zustand';

export interface TimelineEvent {
  timestamp: number;
  type: 'question' | 'positive' | 'warning' | 'danger' | 'filler' | 'pause' | 'eye_contact_lost';
  label: string;
  detail?: string;
}

export interface QuestionAnswer {
  questionIndex: number;
  questionText: string;
  questionType: string;
  transcript: string;
  wpm: number;
  fillerCount: number;
  pauseCount: number;
  aiScore?: number;
  aiFeedback?: string;
  durationSeconds: number;
  followUpText?: string;
  followUpTranscript?: string;
}

export interface SessionConfig {
  role: string;
  interviewType: string;
  difficulty: string;
  personality: string;
  company?: string;
}

export interface InterviewState {
  // Session setup
  config: SessionConfig;
  setConfig: (config: Partial<SessionConfig>) => void;

  // Session runtime
  sessionId: string | null;
  sessionState: 'IDLE' | 'INTRO' | 'QUESTION' | 'LISTENING' | 'PROCESSING' | 'FOLLOW_UP' | 'COMPLETE';
  setSessionState: (state: InterviewState['sessionState']) => void;

  // Questions
  currentQuestionIndex: number;
  questions: string[];
  answers: QuestionAnswer[];
  addQuestion: (question: string) => void;
  commitAnswer: (answer: Omit<QuestionAnswer, 'questionIndex'>) => void;
  nextQuestion: () => void;

  // Live metrics
  eyeContactScore: number;
  confidenceScore: number;
  setEyeContactScore: (val: number) => void;
  setConfidenceScore: (val: number) => void;

  // Recording
  recordingUrl: string | null;
  setRecordingUrl: (url: string | null) => void;

  // Timeline
  timeline: TimelineEvent[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'timestamp'>) => void;

  // Session timer
  sessionStartTime: number | null;
  startSession: () => void;

  // Reset
  resetSession: () => void;
}

const initialConfig: SessionConfig = {
  role: 'Senior Frontend Developer',
  interviewType: 'Technical & System Architecture',
  difficulty: 'Hard',
  personality: 'Professional & Probing',
  company: 'Google',
};

export const useInterviewStore = create<InterviewState>((set) => ({
  config: initialConfig,
  setConfig: (config) =>
    set((state) => ({ config: { ...state.config, ...config } })),

  sessionId: null,
  sessionState: 'IDLE',
  setSessionState: (sessionState) => set({ sessionState }),

  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  commitAnswer: (answer) =>
    set((state) => ({
      answers: [
        ...state.answers,
        { ...answer, questionIndex: state.currentQuestionIndex },
      ],
    })),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
      sessionState: 'QUESTION',
    })),

  eyeContactScore: 91,
  confidenceScore: 84,
  setEyeContactScore: (val) => set({ eyeContactScore: val }),
  setConfidenceScore: (val) => set({ confidenceScore: val }),

  recordingUrl: null,
  setRecordingUrl: (recordingUrl) => set({ recordingUrl }),

  timeline: [],
  addTimelineEvent: (event) =>
    set((state) => {
      const startTime = state.sessionStartTime ?? Date.now();
      const timestamp = Math.round((Date.now() - startTime) / 1000);
      return {
        timeline: [...state.timeline, { ...event, timestamp }],
      };
    }),

  sessionStartTime: null,
  startSession: () =>
    set({
      sessionStartTime: Date.now(),
      sessionId: `session_${Date.now()}`,
      sessionState: 'QUESTION',
      questions: [],
      answers: [],
      timeline: [],
      currentQuestionIndex: 0,
    }),

  resetSession: () =>
    set({
      sessionId: null,
      sessionState: 'IDLE',
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      timeline: [],
      sessionStartTime: null,
      eyeContactScore: 91,
      confidenceScore: 84,
    }),
}));
