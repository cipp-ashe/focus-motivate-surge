
import React, { useState } from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { TimerSection } from '@/components/timer/TimerSection';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';

const TimerPage: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  
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
