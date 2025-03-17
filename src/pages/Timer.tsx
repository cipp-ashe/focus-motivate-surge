
import React, { useState, useEffect } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { TimerSection } from '@/components/timer/TimerSection';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';
import { eventManager } from '@/lib/events/EventManager';
import { Quote } from '@/types/timer';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Timer Component Error</h2>
    <p className="mb-2">There was a problem loading the timer.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300">
      <summary>Technical Details</summary>
      <p className="mt-1">{error.message}</p>
    </details>
  </div>
);

const TimerPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use event manager directly for timer-specific events
  const handleTimerInitialization = () => {
    console.log('TimerPage: Timer component initialized');
    setIsInitialized(true);
    eventManager.emit('page:timer-ready', {});
  };
  
  useEffect(() => {
    // Set up page-specific initialization
    handleTimerInitialization();
    
    // Clean up any timer-specific resources if needed
    return () => {
      console.log('TimerPage: Cleaning up timer page resources');
    };
  }, []);
  
  useEffect(() => {
    if (!isInitialized) {
      const timeout = setTimeout(() => {
        toast.info('Initializing timer components...');
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isInitialized]);
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TaskSelectionProvider>
        <TaskLayout
          mainContent={
            <div className="w-full h-full">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TimerSection 
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </ErrorBoundary>
            </div>
          }
          asideContent={
            <div className="w-full">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <TaskManager key="timer-task-manager" isTimerView={true} />
              </ErrorBoundary>
            </div>
          }
        />
      </TaskSelectionProvider>
    </ErrorBoundary>
  );
};

export default TimerPage;
