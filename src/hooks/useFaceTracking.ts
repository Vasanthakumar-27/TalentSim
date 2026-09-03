import { useEffect, useRef, useState } from 'react';

interface UseFaceTrackingReturn {
  eyeContactScore: number;
  faceDetected: boolean;
  headPosture: 'Centered' | 'Tilted' | 'Looking Away' | 'No FaceDetected';
  isInitializing: boolean;
}

export function useFaceTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean = true
): UseFaceTrackingReturn {
  const [eyeContactScore, setEyeContactScore] = useState<number>(92);
  const [faceDetected, setFaceDetected] = useState<boolean>(true);
  const [headPosture, setHeadPosture] = useState<'Centered' | 'Tilted' | 'Looking Away' | 'No FaceDetected'>('Centered');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);
  const faceMeshRef = useRef<any>(null);
  const eyeScoresHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) {
      setIsInitializing(false);
      return;
    }

    const FaceMeshConstructor = (window as any).FaceMesh;

    if (typeof FaceMeshConstructor !== 'function') {
      setIsInitializing(false);
      return;
    }

    let isMounted = true;

    try {
      const faceMesh = new FaceMeshConstructor({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results: any) => {
        if (!isMounted) return;

        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
          setFaceDetected(false);
          setHeadPosture('No FaceDetected');
          setEyeContactScore((prev) => Math.max(50, prev - 2));
          return;
        }

        setFaceDetected(true);
        const landmarks = results.multiFaceLandmarks[0];

        // Key Landmarks
        // Nose tip: 1
        // Left cheek: 234, Right cheek: 454
        // Top forehead: 10, Chin: 152
        const nose = landmarks[1];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        if (nose && leftCheek && rightCheek) {
          // Horizontal symmetry check (Yaw / Facing forward)
          const distLeft = Math.abs(nose.x - leftCheek.x);
          const distRight = Math.abs(nose.x - rightCheek.x);
          const ratio = Math.min(distLeft, distRight) / Math.max(distLeft, distRight || 0.001);

          let posture: 'Centered' | 'Tilted' | 'Looking Away' | 'No FaceDetected' = 'Centered';
          let frameScore = 95;

          if (ratio < 0.45) {
            posture = 'Looking Away';
            frameScore = 60;
          } else if (ratio < 0.7) {
            posture = 'Tilted';
            frameScore = 80;
          } else {
            posture = 'Centered';
            frameScore = 92 + Math.round((ratio - 0.7) * 20);
          }

          setHeadPosture(posture);

          // Smooth score with rolling history
          const history = eyeScoresHistoryRef.current;
          history.push(frameScore);
          if (history.length > 15) history.shift();

          const avgScore = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
          setEyeContactScore(Math.min(99, Math.max(55, avgScore)));
        }

        setIsInitializing(false);
      });

      faceMeshRef.current = faceMesh;

      // Detection Loop
      const processFrame = async () => {
        if (
          videoRef.current &&
          videoRef.current.readyState >= 2 &&
          !videoRef.current.paused &&
          !videoRef.current.ended
        ) {
          try {
            await faceMesh.send({ image: videoRef.current });
          } catch {
            // Silently swallow frame process errors
          }
        }
        if (isMounted) {
          animFrameRef.current = requestAnimationFrame(processFrame);
        }
      };

      processFrame();
    } catch {
      setIsInitializing(false);
    }

    return () => {
      isMounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [enabled, videoRef]);

  return {
    eyeContactScore,
    faceDetected,
    headPosture,
    isInitializing,
  };
}
