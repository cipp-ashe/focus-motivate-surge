
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
    logger.debug('App', 'Current background color style:', document.documentElement.style.backgroundColor);
    
    // Ensure theme is applied to document elements with explicit styles
    document.documentElement.classList.add('bg-background', 'text-foreground');
    document.body.classList.add('bg-background', 'text-foreground');
    document.documentElement.style.backgroundColor = 'hsl(var(--background))';
    document.body.style.backgroundColor = 'hsl(var(--background))';
    
    // Debug after adding classes
    logger.debug('App', 'After classes added - background color style:', document.documentElement.style.backgroundColor);
    
    // Clean up function
    return () => {
      console.log("App component unmounting");
      document.documentElement.classList.remove('bg-background', 'text-foreground');
      document.body.classList.remove('bg-background', 'text-foreground');
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
          <div className="min-h-screen w-full bg-background text-foreground transition-all duration-300">
            <RouterProvider router={router} fallbackElement={
              <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <p className="text-lg">Loading application...</p>
              </div>
            } />
            <Toaster position="top-right" />
          </div>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
