
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
    <DebugProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
      <DebugPanel />
    </DebugProvider>
  );
};

export default App;
