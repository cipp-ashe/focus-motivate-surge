
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/theme/ThemeProvider';
import { AuthProvider } from './contexts/auth/AuthContext';
import { TaskProvider } from './contexts/tasks/TaskContext';
import { useEventSynchronizer } from './hooks/useEventSynchronizer';
import { useSupabaseRealtime } from './hooks/useSupabaseRealtime';
import { enableRealtimeForTables } from './lib/supabase/client';

function AppContent() {
  // Use our hooks for Supabase realtime and event synchronization
  useSupabaseRealtime();
  useEventSynchronizer();
  
  return <RouterProvider router={router} />;
}

function App() {
  // Enable realtime for tables when the app starts
  useEffect(() => {
    enableRealtimeForTables();
  }, []);
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
          <Toaster position="top-right" richColors />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
