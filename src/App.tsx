
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { DebugProvider } from '@/providers/DebugProvider';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { Toaster } from '@/components/ui/sonner';
import router from './router';
import './index.css';
import './styles/animations.css';

const App: React.FC = () => {
  console.log('App rendering');
  
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-100">
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
      <DebugPanel />
    </div>
  );
};

export default App;
