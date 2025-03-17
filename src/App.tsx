
import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { setupGlobalErrorHandlers } from './utils/errorHandler';
import { toast } from 'sonner';

// Set up global error handling
setupGlobalErrorHandlers();

function App() {
  const [initError, setInitError] = useState<Error | null>(null);
  
  useEffect(() => {
    console.log("App initialized successfully");
    
    // Clean up function
    return () => {
      console.log("App component unmounting");
    };
  }, []);
  
  // Show error state if initialization failed
  if (initError) {
    return (
      <div className="flex items-center justify-center h-screen">
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
  
  // Provide the router
  return <RouterProvider router={router} />;
}

export default App;
