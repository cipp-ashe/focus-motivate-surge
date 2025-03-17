
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataInitialization } from '@/hooks/data/useDataInitialization';
import { toast } from 'sonner';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { isInitialized, error, clearStorage, showClearButton } = useDataInitialization();
  
  useEffect(() => {
    if (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize application');
    }
  }, [error]);
  
  // For debugging only - remove in production
  const handleForceNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-8">Welcome to Focus Notes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <button 
          onClick={() => navigate('/tasks')}
          className="p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Tasks</h2>
          <p className="text-muted-foreground">Create and manage your tasks</p>
        </button>
        
        <button 
          onClick={() => navigate('/timer')}
          className="p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Timer</h2>
          <p className="text-muted-foreground">Focus using the timer</p>
        </button>
        
        <button 
          onClick={() => navigate('/notes')}
          className="p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Notes</h2>
          <p className="text-muted-foreground">Create and organize your notes</p>
        </button>
        
        <button 
          onClick={() => navigate('/habits')}
          className="p-6 bg-card hover:bg-card/90 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">Habits</h2>
          <p className="text-muted-foreground">Build and track your habits</p>
        </button>
      </div>
      
      {showClearButton && (
        <div className="mt-8">
          <button 
            onClick={clearStorage}
            className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded"
          >
            Reset Application Data
          </button>
          <p className="text-sm text-muted-foreground mt-2">
            Try resetting the application data if you're experiencing issues.
          </p>
        </div>
      )}
      
      {!isInitialized && !error && (
        <div className="mt-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4">Initializing application...</p>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
