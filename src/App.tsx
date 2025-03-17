
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEventSynchronizer } from './hooks/useEventSynchronizer';
import { useSupabaseRealtime } from './hooks/useSupabaseRealtime';
import { enableRealtimeForTables } from './lib/supabase/client';
import AppLayout from './components/AppLayout';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  
  // Use our hooks for Supabase realtime and event synchronization
  useSupabaseRealtime();
  useEventSynchronizer();
  
  // Enable realtime for tables when the app starts
  useEffect(() => {
    console.log("App component mounted, initializing...");
    try {
      enableRealtimeForTables();
      console.log("Realtime tables enabled successfully");
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize realtime tables:", error);
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
