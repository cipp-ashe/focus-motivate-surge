
/**
 * Hook for handling and reporting exceptions
 */
import { useEffect, useState } from 'react';
import { DebugModule, debugStore, logger, IS_DEV } from '@/utils/debug';

interface UseExceptionReportingOptions {
  module: DebugModule;
  component: string;
  enabled?: boolean;
  captureGlobalErrors?: boolean;
}

export function useExceptionReporting(options: UseExceptionReportingOptions) {
  const {
    module,
    component,
    enabled = true,
    captureGlobalErrors = false,
  } = options;

  // Local state to manage errors
  const [error, setError] = useState<Error | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  // Handler to capture and report errors
  const handleError = (error: Error, errorInfo?: React.ErrorInfo) => {
    if (!enabled) return;
    
    setError(error);
    setHasError(true);
    
    // Add to debug store
    debugStore.addEvent({
      type: 'error',
      module,
      component,
      message: `Error: ${error.message}`,
      timestamp: Date.now(),
      data: {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        componentStack: errorInfo?.componentStack,
      },
    });
    
    // Log the error
    logger.error(
      `${module}:${component}`,
      `🚨 ERROR: ${error.message}`,
      { error, componentStack: errorInfo?.componentStack }
    );
    
    // In development, log additional details to console
    if (IS_DEV) {
      console.error('Error details:', {
        error,
        componentStack: errorInfo?.componentStack,
        component,
        module,
      });
    }
  };

  // Set up global error handling
  useEffect(() => {
    if (!enabled || !captureGlobalErrors) return;
    
    // Handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      handleError(error);
    };
    
    // Handler for uncaught errors
    const handleWindowError = (event: ErrorEvent) => {
      if (event.error) {
        handleError(event.error);
      } else {
        handleError(new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`));
      }
    };
    
    // Add global event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleWindowError);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleWindowError);
    };
  }, [enabled, captureGlobalErrors]);

  // Function to reset the error state
  const resetError = () => {
    setError(null);
    setHasError(false);
  };

  // Return error state and handlers
  return {
    error,
    hasError,
    handleError,
    resetError,
  };
}
