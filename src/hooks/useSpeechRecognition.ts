import { useCallback, useEffect, useRef, useState } from 'react';

export interface FillerResult {
  count: number;
  breakdown: Record<string, number>;
}

export interface SpeechResult {
  interimTranscript: string;
  finalTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  wpm: number;
  fillers: FillerResult;
  pauseCount: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'right', 'so'];

function detectFillers(text: string): FillerResult {
  const lower = text.toLowerCase();
  const breakdown: Record<string, number> = {};
  let count = 0;

  FILLER_WORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      breakdown[word] = matches.length;
      count += matches.length;
    }
  });

  return { count, breakdown };
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function useSpeechRecognition(): SpeechResult {
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [fillers, setFillers] = useState<FillerResult>({ count: 0, breakdown: {} });
  const [pauseCount, setPauseCount] = useState(0);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    setWpm(0);
    setFillers({ count: 0, breakdown: {} });
    setPauseCount(0);
    startTimeRef.current = null;
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    startTimeRef.current = Date.now();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        setFinalTranscript((prev) => {
          const fullText = prev + final;

          // Calculate WPM
          const wordCount = countWords(fullText);
          const elapsedMinutes = (Date.now() - (startTimeRef.current || Date.now())) / 60000;
          if (elapsedMinutes > 0) {
            setWpm(Math.round(wordCount / elapsedMinutes));
          }

          // Detect filler words
          setFillers(detectFillers(fullText));

          return fullText;
        });

        // Pause detection: reset timer on each new speech result
        if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = setTimeout(() => {
          if (isListening) {
            setPauseCount((prev) => prev + 1);
          }
        }, 2000); // 2s silence = a pause
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') return; // Normal, ignore
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (recognitionRef.current && isListening) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      }
    };

    recognition.start();
  }, [isSupported, isListening]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return {
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    wpm,
    fillers,
    pauseCount,
    startListening,
    stopListening,
    resetTranscript,
  };
}
