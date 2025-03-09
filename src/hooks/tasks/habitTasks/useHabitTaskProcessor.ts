
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';

/**
 * Hook for processing habit tasks with improved localStorage synchronization
 */
export const useHabitTaskProcessor = () => {
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
      
      // Task doesn't exist yet, create it
      const taskId = crypto.randomUUID();
      
      // Create the task object
      const task: Task = {
        id: taskId,
        name: event.name,
        completed: false,
        duration: event.duration,
        createdAt: new Date().toISOString(),
        relationships: {
          habitId: event.habitId,
          templateId: event.templateId,
          date: event.date
        }
      };
      
      // First, store directly in localStorage for persistence
      const updatedTasks = [...storedTasks, task];
      localStorage.setItem('taskList', JSON.stringify(updatedTasks));
      console.log(`Directly added habit task to localStorage: ${task.name} (${task.id})`);
      
      // Then emit event for state management
      setTimeout(() => {
        eventBus.emit('task:create', task);
        console.log(`Emitted task:create event for ${task.name} (${task.id})`);
        
        // Add the Habit tag
        eventBus.emit('tag:add', {
          tagName: 'Habit',
          entityId: taskId,
          entityType: 'task'
        });
        
        // Add template tag if available
        if (event.templateId) {
          // Format template name correctly
          let templateName = event.templateId
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
            
          eventBus.emit('tag:add', {
            tagName: templateName,
            entityId: taskId,
            entityType: 'task'
          });
        }
        
        // Create relationship between habit and task
        eventBus.emit('relationship:create', {
          sourceId: event.habitId,
          sourceType: 'habit',
          targetId: taskId,
          targetType: 'task',
          relationType: 'habit-task'
        });
        
        // Force an update to ensure the task is displayed
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 100);
      }, 50);
    } catch (error) {
      console.error('Error processing habit task:', error);
    }
  }, []);
  
  // Hook up event listener in the component that uses this hook
  return { processHabitTask };
};
