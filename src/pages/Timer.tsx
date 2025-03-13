
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Timer } from '@/components/timer/Timer';

interface TimerPageProps {}

const TimerPage: React.FC<TimerPageProps> = () => {
  const isMobile = useIsMobile();
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isCompletionVisible, setIsCompletionVisible] = useState(false);
  
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
  }, []);
  
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
        key={timerKey}
        taskName={selectedTaskName}
        onComplete={handleTimerComplete}
        onAddTime={() => console.log('Adding time')}
        onDurationChange={(duration) => console.log('Duration changed to', duration)}
        showCelebration={isCompletionVisible}
        setFavorites={() => {}}
        favorites={[]}
      />
    </div>
  );
  
  const TaskSection = (
    <div className="w-full">
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
