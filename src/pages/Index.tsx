
import React, { useEffect, useState, useRef } from 'react';
import { useDataInitialization } from '@/hooks/data/useDataInitialization';
import { toast } from 'sonner';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCardGrid from '@/components/dashboard/DashboardCardGrid';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';
import { logError } from '@/utils/errorHandler';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Dashboard Error</h2>
    <p className="mb-2">There was a problem loading the dashboard.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300 mb-4">
      <summary>Technical Details</summary>
      <p className="mt-1">{error.message}</p>
      {error.stack && (
        <pre className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded text-xs overflow-auto">
          {error.stack}
        </pre>
      )}
    </details>
    <Button onClick={resetErrorBoundary}>Try Again</Button>
  </div>
);

// Flag to track if dashboard content has been rendered
let dashboardContentRendered = false;

const DashboardContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { isInitialized, error, clearStorage } = useDataInitialization();
  const renderCountRef = useRef(0);
  const mountedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Prevent duplicate mount effects
    if (mountedRef.current) return;
    mountedRef.current = true;
    
    // Update render count
    renderCountRef.current += 1;
    console.log(`Dashboard content rendering #${renderCountRef.current}, initialization status:`, { isInitialized, error });
    
    if (error) {
      logError('Dashboard', 'Failed to initialize application', error);
      toast.error('Failed to initialize application');
    }
    
    // Set a timeout to show content even if initialization takes too long
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (loading) {
        setLoading(false);
        console.log("Dashboard forced to show due to timeout");
      }
      timeoutRef.current = null;
    }, 2000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [error]);
  
  useEffect(() => {
    if (isInitialized && loading) {
      setLoading(false);
      console.log("Dashboard initialized successfully");
    }
  }, [isInitialized, loading]);
  
  // Already rendered - just return the dashboard
  if (dashboardContentRendered) {
    return (
      <div className="space-y-8">
        <header className="space-y-2 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Focus Notes</h1>
            <p className="text-muted-foreground">
              Organize your tasks, notes, and habits in one place
            </p>
          </div>
          <Link to="/settings" className="p-2 rounded-full hover:bg-accent transition-colors" title="Settings">
            <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Link>
        </header>
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <DashboardCardGrid />
        </ErrorBoundary>
      </div>
    );
  }
  
  if (loading && !isInitialized && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4">Initializing application...</p>
      </div>
    );
  }
  
  if (error) {
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
  
  // Set rendered flag to true
  dashboardContentRendered = true;
  
  return (
    <div className="space-y-8">
      <header className="space-y-2 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Focus Notes</h1>
          <p className="text-muted-foreground">
            Organize your tasks, notes, and habits in one place
          </p>
        </div>
        <Link to="/settings" className="p-2 rounded-full hover:bg-accent transition-colors" title="Settings">
          <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Link>
      </header>
      
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DashboardCardGrid />
      </ErrorBoundary>
    </div>
  );
};

// Simple cache to prevent multiple IndexPage renderings
let indexPageMounted = false;

const IndexPage: React.FC = () => {
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    // Prevent duplicate mount effects
    if (indexPageMounted) return;
    indexPageMounted = true;
    
    renderCountRef.current += 1;
    console.log(`Rendering IndexPage component #${renderCountRef.current}`);
  }, []);
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log("Error boundary reset - reloading page");
        window.location.reload();
      }}
      onError={(error) => {
        logError('IndexPage', 'Error caught by boundary', error);
      }}
    >
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default IndexPage;
