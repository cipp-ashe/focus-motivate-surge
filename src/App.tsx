
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { Toaster as SonnerToaster } from 'sonner';
import { queryClient } from '@/lib/query';

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TaskProvider>
            <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
              <RouterProvider router={router} />
              <Toaster />
              <SonnerToaster position="bottom-right" />
            </ThemeProvider>
          </TaskProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
