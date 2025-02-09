
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ErrorInfo {
  componentStack?: string;
  message: string;
  timestamp: Date;
}

export const useErrorBoundary = (componentName: string) => {
  const [error, setError] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorInfo = {
        message: event.error?.message || event.message,
        componentStack: event.error?.stack,
        timestamp: new Date(),
      };

      console.error(`[${componentName}] Error:`, errorInfo);
      setError(errorInfo);
      
      // Show toast notification for user feedback
      toast.error(`Error in ${componentName}: ${errorInfo.message}`, {
        description: "Check console for more details",
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorInfo = {
        message: event.reason?.message || 'Promise rejected',
        componentStack: event.reason?.stack,
        timestamp: new Date(),
      };

      console.error(`[${componentName}] Unhandled Promise Rejection:`, errorInfo);
      setError(errorInfo);
      
      toast.error(`Async Error in ${componentName}: ${errorInfo.message}`, {
        description: "Check console for more details",
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [componentName]);

  return {
    error,
    clearError: () => setError(null),
  };
};
