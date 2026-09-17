import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import { errorMonitor } from "../services/error.service";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
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
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    console.error("Uncaught error:", error, errorInfo);
    errorMonitor.captureException(error, { reactErrorInfo: errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optionally reload the page or navigate home
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">Something went wrong</h2>
              <p className="text-zinc-400 text-sm">
                We've encountered an unexpected error. Our team has been notified.
              </p>
            </div>

            <div className="bg-zinc-950 rounded border border-zinc-800 p-3 text-left overflow-auto max-h-32">
              <code className="text-xs text-red-400 break-words">
                {this.state.error?.message || "Unknown error"}
              </code>
            </div>

            <Button onClick={this.handleReset} className="w-full">
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
