
import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { setupGlobalErrorHandlers } from './utils/errorHandler';
import { toast, Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './contexts/auth/AuthContext';
import { TaskProvider } from './contexts/tasks/TaskContext';
import { logger } from './utils/logManager';

// Set up global error handling
setupGlobalErrorHandlers();

function App() {
  const [initError, setInitError] = useState<Error | null>(null);
  
  useEffect(() => {
    console.log("App initialized successfully");
    logger.debug('App', 'Current theme class on HTML:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    
    // Force proper color scheme by checking if theme classes exist, adding if needed
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('vite-ui-theme') as string | null;
    const effectiveTheme = 
      savedTheme === 'dark' ? 'dark' : 
      savedTheme === 'light' ? 'light' : 
      prefersDark ? 'dark' : 'light';
    
    if (!root.classList.contains('dark') && !root.classList.contains('light')) {
      root.classList.add(effectiveTheme);
      logger.debug('App', `Theme class missing - adding ${effectiveTheme} on mount`);
    }
    
    // Clean up function
    return () => {
      console.log("App component unmounting");
    };
  }, []);
  
  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="bg-destructive/10 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-destructive mb-3">Application Error</h2>
          <p className="mb-4">{initError.message}</p>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <AuthProvider>
        <TaskProvider>
          <div className="app-root min-h-screen w-full bg-background text-foreground">
            <RouterProvider router={router} fallbackElement={
              <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <p className="text-lg animate-pulse">Loading application...</p>
              </div>
            } />
            <Toaster 
              position="top-right" 
              toastOptions={{
                className: "bg-card text-card-foreground border border-border shadow-lg",
                style: {
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                  border: "1px solid var(--border)"
                }
              }}
            />
          </div>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
