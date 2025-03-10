
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { toast } from 'sonner';

/**
 * Hook for creating habit-related tasks
 */
export const useHabitTaskCreator = () => {
  /**
   * Create a new task for a habit and emit events
   */
  const createHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    duration: number,
    date: string
  ): string | null => {
    if (!habitId || !name) {
      console.error('Invalid habit task parameters:', { habitId, name });
      return null;
    }
    
    try {
      // First check if a task already exists for this habit+date
      const existingTask = taskStorage.taskExists(habitId, date);
      if (existingTask) {
        console.log(`Task already exists for habit ${habitId} on ${date}:`, existingTask);
        
        // Force a UI update for the existing task
        window.dispatchEvent(new Event('force-task-update'));
        eventBus.emit('task:create', existingTask);
        
        return existingTask.id;
      }
      
      // Generate task ID
      const taskId = uuidv4();
      
      // Create task object
      const task: Task = {
        id: taskId,
        name: name,
        description: `Habit task for ${date}`,
        completed: false,
        duration: duration,
        createdAt: new Date().toISOString(),
        relationships: {
          habitId: habitId,
          templateId: templateId,
          date: date
        }
      };
      
      console.log(`Creating habit task: ${taskId} for habit ${habitId}`, task);
      
      // Save to storage FIRST to ensure persistence
      taskStorage.addTask(task);
      
      // Emit event to create task
      eventBus.emit('task:create', task);
      
      // Force UI update after a short delay
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 100);
      
      toast.success(`Added habit task: ${name}`, {
        description: "Task added to your list"
      });
      
      return taskId;
    } catch (error) {
      console.error('Error creating habit task:', error);
      toast.error('Failed to create habit task');
      return null;
    }
  }, []);
  
  return { createHabitTask };
};
