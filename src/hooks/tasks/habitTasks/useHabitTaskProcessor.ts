import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { useHabitTaskCreator } from './useHabitTaskCreator';

/**
 * Hook for processing habit tasks with improved localStorage synchronization
 */
export const useHabitTaskProcessor = () => {
  const { createHabitTask } = useHabitTaskCreator();
  
  // Process a single habit task event
  const processHabitTask = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  }) => {
    console.log(`Processing habit task schedule:`, event);
    
    // First, check if a task for this habit already exists in localStorage
    try {
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const existingTask = storedTasks.find((task: Task) => 
        task.relationships?.habitId === event.habitId && 
        task.relationships?.date === event.date
      );
      
      if (existingTask) {
        console.log(`Task already exists for habit ${event.habitId} on ${event.date}, skipping creation`);
        
        // Ensure task is loaded into memory state
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 50);
        
        return;
      }
      
      // Create the habit task using the creator hook
      createHabitTask(
        event.habitId,
        event.templateId,
        event.name,
        event.duration,
        event.date
      );
      
    } catch (error) {
      console.error('Error processing habit task:', error);
    }
  }, [createHabitTask]);
  
  // Handle habit schedule events from the event bus
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  }) => {
    processHabitTask(event);
  }, [processHabitTask]);
  
  // Process any pending tasks (useful after navigation or initial load)
  const processPendingTasks = useCallback(() => {
    console.log('Checking for any pending habit tasks...');
    // This is just a placeholder for now to ensure the API matches
    // In a real implementation, we might query localStorage for unprocessed tasks
    
    // Force task update
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 100);
  }, []);
  
  // Hook up event listener in the component that uses this hook
  return { 
    processHabitTask,
    handleHabitSchedule,
    processPendingTasks
  };
};
