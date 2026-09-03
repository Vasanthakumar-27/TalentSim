import { useState, useRef, useCallback } from 'react';

interface UseRecorderReturn {
  isRecording: boolean;
  recordingBlobUrl: string | null;
  startRecording: (stream: MediaStream) => void;
  stopRecording: () => Promise<string | null>;
  resetRecording: () => void;
}

export function useRecorder(): UseRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback((stream: MediaStream) => {
    if (!stream || !window.MediaRecorder) return;

    try {
      chunksRef.current = [];
      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? { mimeType: 'video/webm;codecs=vp9,opus' }
        : MediaRecorder.isTypeSupported('video/webm')
        ? { mimeType: 'video/webm' }
        : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(1000); // 1s slice
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingBlobUrl(url);
        setIsRecording(false);
        resolve(url);
      };

      recorder.stop();
    });
  }, []);

  const resetRecording = useCallback(() => {
    if (recordingBlobUrl) {
      URL.revokeObjectURL(recordingBlobUrl);
    }
    setRecordingBlobUrl(null);
    setIsRecording(false);
    chunksRef.current = [];
  }, [recordingBlobUrl]);

  return {
    isRecording,
    recordingBlobUrl,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
