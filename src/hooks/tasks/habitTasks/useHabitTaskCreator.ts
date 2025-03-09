
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { useTagSystem } from '@/hooks/useTagSystem';
import { useTaskEvents } from '../useTaskEvents';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for creating habit tasks with improved storage handling
 */
export const useHabitTaskCreator = () => {
  const { addTagToEntity } = useTagSystem();
  const { createTask, forceTaskUpdate } = useTaskEvents();
  
  /**
   * Create a new task for a habit with improved storage handling and verification
   */
  const createHabitTask = useCallback((
    habitId: string, 
    templateId: string, 
    name: string, 
    duration: number, 
    date: string
  ) => {
    console.log(`Creating new task for habit ${habitId}:`, { name, duration, date });
    
    try {
      // First check if this task already exists
      const existingTask = taskStorage.taskExists(habitId, date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${habitId} on ${date}:`, existingTask);
        
        // No need to create a new task, just ensure it's in memory
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
          forceTaskUpdate();
        }, 100);
        
        return existingTask.id;
      }
      
      // Generate a task ID - use UUID for guaranteed uniqueness
      const taskId = crypto.randomUUID();
      
      // Ensure we're storing the duration in seconds
      const durationInSeconds = typeof duration === 'number' ? duration : 1500;
      
      const task: Task = {
        id: taskId,
        name,
        completed: false,
        duration: durationInSeconds, // Store in seconds
        createdAt: new Date().toISOString(),
        relationships: {
          habitId,
          templateId,
          date
        }
      };
      
      // Add task directly to state through the createTask function instead of just emitting an event
      // This ensures the task is immediately available in the UI
      createTask(task);
      
      // Add the Habit tag
      addTagToEntity('Habit', taskId, 'task');
      
      // Add template tag if available (format for readability)
      if (templateId) {
        // Format template name correctly with first letter capitalized
        let templateName = '';
        
        if (templateId.includes('-')) {
          // Handle kebab-case: "morning-routine" -> "Morning Routine"
          templateName = templateId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        } else {
          // Handle camelCase: "morningRoutine" -> "Morning Routine"
          templateName = templateId
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
        }
        
        console.log(`Adding template tag "${templateName}" to task ${taskId}`);
        addTagToEntity(templateName, taskId, 'task');
      }
      
      // Create relationship
      eventBus.emit('relationship:create', {
        sourceId: habitId,
        sourceType: 'habit',
        targetId: taskId,
        targetType: 'task',
        relationType: 'habit-task'
      });
      
      // Show notification
      toast.success(`Created habit task: ${name}`, {
        description: `The ${name} task has been added to your list.`
      });
      
      // Multiple force updates with progressive timeouts for maximum reliability
      [100, 300, 600].forEach(delay => {
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
          forceTaskUpdate();
        }, delay);
      });
      
      return taskId;
    } catch (error) {
      console.error('Error creating habit task:', error);
      toast.error('Failed to create habit task');
      return null;
    }
  }, [addTagToEntity, forceTaskUpdate, createTask]);
  
  return { createHabitTask };
};
