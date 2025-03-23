
import React, { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { EmptyTimerState } from './EmptyTimerState';
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { Quote } from '@/types/timer';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Card, CardContent } from '@/components/ui/card';

interface TimerSectionProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerSection: React.FC<TimerSectionProps> = ({ 
  favorites = [], 
  setFavorites 
}) => {
  const { selectedTask, selectTask, clearSelectedTask } = useTaskSelection();
  const [selectedTaskState, setSelectedTaskState] = useState(selectedTask);
  const taskContext = useTaskContext();
  
  // Check for selected task in tasks context if not already selected
  useEffect(() => {
    if (!selectedTask && taskContext?.selected) {
      const selectedTaskFromContext = taskContext.items.find(task => task.id === taskContext.selected);
      if (selectedTaskFromContext) {
        console.log("TimerSection: Found selected task in context:", selectedTaskFromContext.name);
        selectTask(selectedTaskFromContext);
      }
    }
  }, [taskContext?.selected, taskContext?.items, selectedTask, selectTask]);
  
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
  
  // Listen for timer:set-task events using eventManager only (no window events)
  useEffect(() => {    
    // Listen with event manager
    const unsubscribe = eventManager.on('timer:set-task', (payload) => {
      console.log('TimerSection: Received timer:set-task from eventManager', payload);
      if (payload && typeof payload === 'object' && 'id' in payload) {
        // Create a valid Task object
        const task: Task = {
          id: payload.id,
          name: payload.name,
          duration: payload.duration || 1500,
          completed: payload.completed || false,
          createdAt: payload.createdAt || new Date().toISOString()
        };
        
        selectTask(task);
        
        // Emit a task-set event for any components that need to know
        eventManager.emit('timer:task-set', {
          id: task.id,
          name: task.name,
          duration: task.duration || 1500,
          taskId: task.id
        });
      }
    });
    
    return () => {
      unsubscribe();
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
    <div className="w-full h-full p-4">
      {selectedTaskState ? (
        <Timer 
          key={selectedTaskState.id}
          duration={selectedTaskState.duration || 1500}
          taskName={selectedTaskState.name}
          onComplete={(metrics) => handleTaskCompleted(selectedTaskState.id, metrics)}
          onAddTime={() => handleTaskReset(selectedTaskState.id)}
          onDurationChange={undefined}
          favorites={favorites}
          setFavorites={setFavorites}
          taskId={selectedTaskState.id}
        />
      ) : (
        <EmptyTimerState />
      )}
    </div>
  );
};
