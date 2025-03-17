
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { router } from './router';
import './index.css';

// Add initialization logging
console.log('Application bootstrap starting...');

// Error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

try {
  console.log('Rendering root component...');
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
  console.log('Root component rendered successfully');
} catch (error) {
  console.error('Critical error during application initialization:', error);
  // Render fallback UI
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
        <h2 style="color: #e11d48;">Application Error</h2>
        <p>Sorry, the application failed to start. Please check the console for more details.</p>
        <button onclick="window.location.reload()">Reload Application</button>
      </div>
    `;
  }
}
