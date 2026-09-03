import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-rose-400">TalentSim Runtime Recovery</h2>
            <p className="text-xs text-zinc-400">
              An unexpected browser module error occurred. Click reload to refresh your session.
            </p>
            <p className="text-[11px] font-mono text-zinc-500 bg-black/60 p-2 rounded text-left overflow-auto max-h-32">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
