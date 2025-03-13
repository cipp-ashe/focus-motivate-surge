
import React, { useState } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { TimerSection } from '@/components/timer/TimerSection';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';
import { eventManager } from '@/lib/events/EventManager';
import { Quote } from '@/types/timer';

const TimerPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  
  // Use event manager directly for timer-specific events
  const handleTimerInitialization = () => {
    console.log('TimerPage: Timer component initialized');
    eventManager.emit('page:timer-ready', {});
  };
  
  React.useEffect(() => {
    // Set up page-specific initialization
    handleTimerInitialization();
    
    // Clean up any timer-specific resources if needed
    return () => {
      console.log('TimerPage: Cleaning up timer page resources');
    };
  }, []);
  
  return (
    <TaskSelectionProvider>
      <TaskLayout
        mainContent={
          <div className="w-full h-full">
            <TimerSection 
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </div>
        }
        asideContent={
          <div className="w-full">
            <TaskManager key="timer-task-manager" isTimerView={true} />
          </div>
        }
      />
    </TaskSelectionProvider>
  );
};

export default TimerPage;
