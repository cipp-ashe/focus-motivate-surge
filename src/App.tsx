
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Router } from '@/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { Sonner } from '@/components/sonner';

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TaskProvider>
            <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
              <Router />
              <Toaster />
              <Sonner />
            </ThemeProvider>
          </TaskProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
