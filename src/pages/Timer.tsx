import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { useLocalStorageData } from '@/hooks/data/useLocalStorageData';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Timer } from '@/components/timer/Timer';

interface TimerPageProps {}

const TimerPage: React.FC<TimerPageProps> = () => {
  const isMobile = useIsMobile();
  const { selectedTaskName, setSelectedTaskName } = useLocalStorageData('selected-task-name', '');
  const { selectedTaskId, setSelectedTaskId } = useLocalStorageData('selected-task-id', '');
  const { isCompletionVisible, setIsCompletionVisible } = useLocalStorageData('completion-visible', false);
  
  const [timerKey, setTimerKey] = useState(Date.now());
  
  useEffect(() => {
    const handleTimerInit = (event: CustomEvent) => {
      const { taskName, duration } = event.detail;
      console.log(`TimerPage - Received timer:init event for ${taskName} with duration ${duration}`);
      setSelectedTaskName(taskName);
      setTimerKey(Date.now());
    };
    
    window.addEventListener('timer:init', handleTimerInit as EventListener);
    
    return () => {
      window.removeEventListener('timer:init', handleTimerInit as EventListener);
    };
  }, [setSelectedTaskName]);
  
  const handleTimerSelect = (task: any) => {
    setSelectedTaskName(task.name);
    setSelectedTaskId(task.id);
    console.log(`TimerPage - Selected task: ${task.name} (${task.id})`);
  };
  
  const handleTimerInitialize = (data: any) => {
    console.log('TimerPage - Initialized timer with data:', data);
  };
  
  const handleTimerComplete = () => {
    console.log('TimerPage - Timer completed');
    setIsCompletionVisible(true);
  };
  
  const handleTimerReset = () => {
    console.log('TimerPage - Timer reset');
  };
  
  const TimerSection = (
    <div className="w-full h-full">
      <Timer
        selectedTaskName={selectedTaskName}
        onTimerInitialize={handleTimerInitialize}
        onTimerComplete={handleTimerComplete}
        onTimerReset={handleTimerReset}
        showCelebration={isCompletionVisible}
        onCelebrationComplete={() => setIsCompletionVisible(false)}
      />
    </div>
  );
  
  const TaskSection = (
    <div className="w-full">
      {/* Fix this part to not pass invalid props */}
      <TaskManager key="timer-task-manager" />
    </div>
  );
  
  return (
    <TaskLayout
      mainContent={TimerSection}
      asideContent={TaskSection}
    />
  );
};

export default TimerPage;
