
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from './components/AppLayout';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  
  // Initialize app
  useEffect(() => {
    console.log("App component mounted, initializing...");
    try {
      // Simple initialization without any external service connections
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize:", error);
      setInitError(error instanceof Error ? error : new Error('Unknown error during initialization'));
    }
  }, []);
  
  // Show a loading state while initializing
  if (!isInitialized && !initError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading application...</p>
        </div>
      </div>
    );
  }
  
  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-destructive/10 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-destructive mb-3">Application Error</h2>
          <p className="mb-4">{initError.message}</p>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default App;
