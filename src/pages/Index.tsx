
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataInitialization } from '@/hooks/data/useDataInitialization';
import { toast } from 'sonner';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCardGrid from '@/components/dashboard/DashboardCardGrid';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Dashboard Error</h2>
    <p className="mb-2">There was a problem loading the dashboard.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300 mb-4">
      <summary>Technical Details</summary>
      <p className="mt-1">{error.message}</p>
    </details>
    <Button onClick={resetErrorBoundary}>Try Again</Button>
  </div>
);

const DashboardContent: React.FC = () => {
  const { isInitialized, error, clearStorage, showClearButton } = useDataInitialization();
  
  useEffect(() => {
    if (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize application: ' + error);
    }
  }, [error]);
  
  if (!isInitialized && error) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Initialization Error</h2>
          <p className="mb-2">There was a problem initializing the application.</p>
          <details className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            <summary>Technical Details</summary>
            <p className="mt-1">{error}</p>
          </details>
          
          <Button variant="destructive" onClick={clearStorage} className="mt-2">
            Reset Application Data
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Focus Notes</h1>
        <p className="text-muted-foreground">
          Organize your tasks, notes, and habits in one place
        </p>
      </header>
      
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DashboardCardGrid />
      </ErrorBoundary>
      
      {showClearButton && (
        <div className="mt-8">
          <Button 
            onClick={clearStorage}
            variant="destructive"
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Reset Application Data
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            If you're experiencing issues, try resetting the application data.
          </p>
        </div>
      )}
      
      {!isInitialized && !error && (
        <div className="mt-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4">Initializing application...</p>
        </div>
      )}
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state when the error boundary is reset
        window.location.reload();
      }}
    >
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default IndexPage;
