
import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { Task } from '@/types/tasks';
import { Quote } from '@/types/timer';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

interface TimerSectionProps {
  selectedTask: Task | null;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerSection: React.FC<TimerSectionProps> = ({ 
  selectedTask, 
  favorites, 
  setFavorites 
}) => {
  // No task selected case
  if (!selectedTask) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Task Selected</h2>
        <p className="text-muted-foreground mb-4">
          Select a task from the list to start the timer.
        </p>
      </div>
    );
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
        key={`timer-${selectedTask.id}`}
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
