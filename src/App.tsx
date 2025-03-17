
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/theme/ThemeProvider';
import { useEventSynchronizer } from './hooks/useEventSynchronizer';
import { useSupabaseRealtime } from './hooks/useSupabaseRealtime';
import { enableRealtimeForTables } from './lib/supabase/client';
import AppLayout from './components/AppLayout';

function App() {
  // Use our hooks for Supabase realtime and event synchronization
  useSupabaseRealtime();
  useEventSynchronizer();
  
  // Enable realtime for tables when the app starts
  useEffect(() => {
    enableRealtimeForTables();
  }, []);
  
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default App;
