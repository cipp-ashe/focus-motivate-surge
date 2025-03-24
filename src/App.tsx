
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { Toast as Sonner } from 'sonner';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TaskProvider>
            <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
              <RouterProvider router={router} />
              <Toaster />
              <Sonner position="bottom-right" />
            </ThemeProvider>
          </TaskProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
