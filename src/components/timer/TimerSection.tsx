
import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { EmptyTimerState } from './EmptyTimerState';
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { Quote } from '@/types/timer';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent';

interface TimerSectionProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerSection: React.FC<TimerSectionProps> = ({ 
  favorites = [], // Add default value
  setFavorites 
}) => {
  const { selectedTask, selectTask, clearSelectedTask } = useTaskSelection();
  const [selectedTaskState, setSelectedTaskState] = useState(selectedTask);
  
  // Update local state when selectedTask changes
  useEffect(() => {
    setSelectedTaskState(selectedTask);
  }, [selectedTask]);
  
  // Listen for task updates to refresh timer if needed
  useEvent('task:update', ({ taskId, updates }) => {
    if (selectedTaskState && selectedTaskState.id === taskId) {
      console.log("TimerSection: Selected task was updated, refreshing", updates);
      
      // If the selected task was updated, refresh it
      setSelectedTaskState({
        ...selectedTaskState,
        ...updates
      });
    }
  });
  
  // Listen for timer:set-task events from window API
  useEffect(() => {
    const handleSetTask = (event: CustomEvent) => {
      const task = event.detail;
      if (!task) return;
      
      console.log('TimerSection: Received timer:set-task event', task);
      
      // Use the taskSelection context to set the task
      if (task.id) {
        selectTask(task);
        
        // Also emit event for other components listening
        eventManager.emit('timer:task-set', {
          taskId: task.id,
          taskName: task.name,
          duration: task.duration || 1500
        });
      }
    };
    
    // Add event listener
    window.addEventListener('timer:set-task', handleSetTask as EventListener);
    
    return () => {
      window.removeEventListener('timer:set-task', handleSetTask as EventListener);
    };
  }, [selectTask]);
  
  // Handle timer completion
  const handleTaskCompleted = (taskId: string, metrics: any) => {
    console.log('Timer completed for task:', taskId, metrics);
    
    // If the completed task is the currently selected one, clear it
    if (selectedTaskState && selectedTaskState.id === taskId) {
      clearSelectedTask();
      
      // Mark the task as completed
      eventManager.emit('task:complete', { 
        taskId,
        metrics
      });
      
      toast.success('Timer session completed', {
        description: `Task "${selectedTaskState.name}" has been marked as complete.`
      });
    }
  };
  
  // Handle timer reset
  const handleTaskReset = (taskId: string) => {
    console.log('Timer reset for task:', taskId);
    
    // Show a toast notification
    if (selectedTaskState) {
      toast.info('Timer reset', {
        description: `Timer for "${selectedTaskState.name}" has been reset.`
      });
    }
  };

  return (
    <div className="w-full h-full">
      {selectedTaskState ? (
        <Timer 
          key={selectedTaskState.id}
          task={selectedTaskState}
          onComplete={(metrics) => handleTaskCompleted(selectedTaskState.id, metrics)}
          onReset={() => handleTaskReset(selectedTaskState.id)}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      ) : (
        <EmptyTimerState />
      )}
    </div>
  );
};
