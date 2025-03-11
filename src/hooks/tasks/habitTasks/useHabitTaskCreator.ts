
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { eventManager } from '@/lib/events/EventManager';
import { Task, TaskType } from '@/types/tasks';
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
    date: string,
    taskType: TaskType = 'regular'
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
        
        // This is critical - we need to emit the task:select event to make it visible in timer page
        eventManager.emit('task:select', existingTask.id);
        
        return existingTask.id;
      }
      
      // Generate task ID
      const taskId = uuidv4();
      
      // Create task object with appropriate task type
      const task: Task = {
        id: taskId,
        name: name,
        description: `Habit task for ${date}`,
        completed: false,
        duration: duration,
        createdAt: new Date().toISOString(),
        taskType: taskType, // Use the specified task type
        relationships: {
          habitId: habitId,
          templateId: templateId,
          date: date
        }
      };
      
      console.log(`Creating habit task: ${taskId} for habit ${habitId} with type ${taskType}`, task);
      
      // Save to storage FIRST to ensure persistence
      taskStorage.addTask(task);
      
      // Emit event to create task
      eventManager.emit('task:create', task);
      
      // Add habit tag
      eventManager.emit('tag:link', {
        tagId: 'habit',
        entityId: taskId,
        entityType: 'task'
      });
      
      // Also add template name as a tag if available
      if (templateId) {
        eventManager.emit('tag:link', {
          tagId: templateId,
          entityId: taskId,
          entityType: 'task'
        });
      }
      
      // Select the task immediately to make it visible on timer page
      eventManager.emit('task:select', taskId);
      
      // Force UI update after a short delay
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 100);
      
      toast.success(`Added habit task: ${name}`, {
        description: `Task added to your ${taskType} list`
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
