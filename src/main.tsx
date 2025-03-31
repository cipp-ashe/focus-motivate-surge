
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { ThemeProvider } from '@/contexts/theme/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { DebugProvider } from '@/providers/DebugProvider';

// Initialize application
import { initializeApplication } from './utils/appInitialization';

// Run initialization before rendering
initializeApplication();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TaskProvider>
          <DebugProvider>
            <RouterProvider router={router} />
            <Toaster />
          </DebugProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
