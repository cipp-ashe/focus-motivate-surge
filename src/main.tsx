
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <TaskProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
