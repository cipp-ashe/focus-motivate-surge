
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { DebugProvider } from '@/providers/DebugProvider';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import router from './router';
import './index.css';
import './styles/animations.css';

const App: React.FC = () => {
  console.log('App rendering');
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="focus-app-theme">
      <AuthProvider>
        <TaskProvider>
          <DebugProvider>
            <div className="min-h-screen bg-background text-foreground">
              <RouterProvider router={router} />
              <Toaster position="top-right" />
              <DebugPanel />
            </div>
          </DebugProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
