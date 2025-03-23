
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router';
import DebugButton from './components/debug/DebugButton';

// Create a new client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="focus-notes-theme">
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
        <DebugButton />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
