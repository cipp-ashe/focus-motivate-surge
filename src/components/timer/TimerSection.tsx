
import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { EmptyTimerState } from './EmptyTimerState';
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { Quote } from '@/types/timer';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

interface TimerSectionProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerSection: React.FC<TimerSectionProps> = ({ 
  favorites = [], // Add default value
  setFavorites 
}) => {
  const { selectedTask, timerKey } = useTaskSelection();

  // No task selected case
  if (!selectedTask) {
    return <EmptyTimerState />;
  }

  const handleTimerComplete = (taskId: string, metrics: any) => {
    console.log('TimerSection - Timer completed for task:', taskId, metrics);
    
    // Mark the task as completed
    eventBus.emit('task:complete', { 
      taskId: selectedTask.id,
      metrics: metrics 
    });
    
    toast.success(`Timer completed for: ${selectedTask.name}`);
  };
  
  const handleAddTime = (minutes: number) => {
    console.log('TimerSection - Adding time to task:', selectedTask.id, minutes);
    
    const currentDuration = selectedTask.duration || 1500;
    const newDuration = currentDuration + (minutes * 60);
    
    // Update the task duration
    eventBus.emit('task:update', {
      taskId: selectedTask.id,
      updates: { duration: newDuration }
    });
    
    toast.info(`Added ${minutes} minutes to: ${selectedTask.name}`);
  };
  
  const handleDurationChange = (minutes: number) => {
    console.log('TimerSection - Updating duration for task:', selectedTask.id, minutes);
    
    const newDuration = minutes * 60;
    
    // Update the task duration
    eventBus.emit('task:update', {
      taskId: selectedTask.id,
      updates: { duration: newDuration }
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <Timer
        key={`timer-${timerKey}`}
        taskName={selectedTask.name}
        duration={selectedTask.duration || 1500}
        onComplete={(metrics) => handleTimerComplete(selectedTask.id, metrics)}
        onAddTime={handleAddTime}
        onDurationChange={handleDurationChange}
        favorites={favorites}
        setFavorites={setFavorites}
      />
    </div>
  );
};
