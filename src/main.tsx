
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Initialize application
import { initializeApplication } from './utils/appInitialization';

// Run initialization before rendering
initializeApplication();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>,
);
