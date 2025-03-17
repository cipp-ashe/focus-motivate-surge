
import React, { useEffect, useState, useRef } from 'react';
import { useDataInitialization } from '@/hooks/data/useDataInitialization';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCardGrid from '@/components/dashboard/DashboardCardGrid';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

// Global flag to prevent multiple initializations
let dashboardInitialized = false;

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
  const [loading, setLoading] = useState(!dashboardInitialized);
  const { isInitialized, error, clearStorage } = useDataInitialization();
  const mountedRef = useRef(false);
  
  // Fast initialization on mount
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    
    console.log(`Dashboard content rendering #1, initialization status:`, { isInitialized, error });
    
    // Mark as initialized
    dashboardInitialized = true;
    
    // Short timeout to show content
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300); // Much shorter timeout
    
    return () => clearTimeout(timeout);
  }, [isInitialized, error]);
  
  // Show content immediately if initialized
  useEffect(() => {
    if (isInitialized && loading) {
      setLoading(false);
      console.log("Dashboard initialized successfully");
    }
  }, [isInitialized, loading]);
  
  if (loading && !isInitialized && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4">Loading dashboard...</p>
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

const IndexPage: React.FC = () => {
  // Simple render with no redundant state
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default IndexPage;
