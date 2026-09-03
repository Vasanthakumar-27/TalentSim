import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioLevelReturn {
  audioLevel: number;        // 0–100 normalized volume
  isAnalyzing: boolean;
  startAnalysis: (stream: MediaStream) => void;
  stopAnalysis: () => void;
}

export function useAudioLevel(): AudioLevelReturn {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const stopAnalysis = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    setIsAnalyzing(false);
    setAudioLevel(0);
  }, []);

  const startAnalysis = useCallback((stream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(new ArrayBuffer(bufferLength));

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;

      setIsAnalyzing(true);

      const tick = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Compute average volume across all frequencies
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const avg = sum / dataArrayRef.current.length;
        const normalized = Math.min(100, Math.round((avg / 255) * 100 * 2.5));

        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch {
      setIsAnalyzing(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, [stopAnalysis]);

  return { audioLevel, isAnalyzing, startAnalysis, stopAnalysis };
}
