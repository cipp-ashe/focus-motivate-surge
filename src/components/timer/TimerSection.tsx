
import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { EmptyTimerState } from './EmptyTimerState';
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { Quote } from '@/types/timer';
import { eventBus } from '@/lib/eventBus';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

interface TimerSectionProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerSection: React.FC<TimerSectionProps> = ({ 
  favorites = [], // Add default value
  setFavorites 
}) => {
  const { selectedTask, timerKey, updateSelectedTask } = useTaskSelection();
  
  // Listen for task updates to refresh timer if needed
  useEffect(() => {
    const handleTaskUpdate = ({ taskId, updates }: { taskId: string, updates: any }) => {
      if (selectedTask && selectedTask.id === taskId) {
        console.log("TimerSection: Selected task was updated, refreshing", updates);
        
        // If the selected task was updated, refresh it
        updateSelectedTask({
          ...selectedTask,
          ...updates
        });
      }
    };
    
    // Listen to both event systems
    eventBus.on('task:update', handleTaskUpdate);
    eventManager.on('task:update', handleTaskUpdate);
    
    return () => {
      eventBus.off('task:update', handleTaskUpdate);
      eventManager.off('task:update', handleTaskUpdate);
    };
  }, [selectedTask, updateSelectedTask]);
  
  // Listen for task completion to handle timer task completion
  useEffect(() => {
    const handleTaskComplete = ({ taskId }: { taskId: string }) => {
      if (selectedTask && selectedTask.id === taskId) {
        console.log("TimerSection: Selected task was completed");
        toast.success(`Task completed: ${selectedTask.name}`);
        
        // Reset selected task after a delay so user sees the completion
        setTimeout(() => {
          updateSelectedTask(null);
        }, 1500);
      }
    };
    
    // Listen to both event systems
    eventBus.on('task:complete', handleTaskComplete);
    eventManager.on('task:complete', handleTaskComplete);
    
    return () => {
      eventBus.off('task:complete', handleTaskComplete);
      eventManager.off('task:complete', handleTaskComplete);
    };
  }, [selectedTask, updateSelectedTask]);

  // No task selected case
  if (!selectedTask) {
    return <EmptyTimerState />;
  }

  const handleTimerComplete = (taskId: string, metrics: any) => {
    console.log('TimerSection - Timer completed for task:', taskId, metrics);
    
    // Mark the task as completed using both event systems
    eventBus.emit('task:complete', { 
      taskId: selectedTask.id,
      metrics: metrics 
    });
    
    eventManager.emit('task:complete', { 
      taskId: selectedTask.id,
      metrics: metrics 
    });
    
    toast.success(`Timer completed for: ${selectedTask.name}`);
  };
  
  const handleAddTime = (minutes: number) => {
    console.log('TimerSection - Adding time to task:', selectedTask.id, minutes);
    
    const currentDuration = selectedTask.duration || 1500;
    const newDuration = currentDuration + (minutes * 60);
    
    // Update the task duration using both event systems
    eventBus.emit('task:update', {
      taskId: selectedTask.id,
      updates: { duration: newDuration }
    });
    
    eventManager.emit('task:update', {
      taskId: selectedTask.id,
      updates: { duration: newDuration }
    });
    
    toast.info(`Added ${minutes} minutes to: ${selectedTask.name}`);
  };
  
  const handleDurationChange = (minutes: number) => {
    console.log('TimerSection - Updating duration for task:', selectedTask.id, minutes);
    
    const newDuration = minutes * 60;
    
    // Update the task duration using both event systems
    eventBus.emit('task:update', {
      taskId: selectedTask.id,
      updates: { duration: newDuration }
    });
    
    eventManager.emit('task:update', {
      taskId: selectedTask.id,
      updates: { duration: newDuration }
    });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <Timer
        key={`timer-${timerKey}-${selectedTask.id}`}
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
