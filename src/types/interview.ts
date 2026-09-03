export interface MediaStreamState {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  error: 'permission_denied' | 'not_found' | 'not_supported' | null;
  cameraEnabled: boolean;
  micEnabled: boolean;
}
