
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
    console.log(`Creating new task for habit ${habitId}:`, { name, duration, date, templateId });
    
    try {
      // First check if this task already exists
      const existingTask = taskStorage.taskExists(habitId, date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${habitId} on ${date}:`, existingTask);
        
        // Ensure it's loaded into memory
        setTimeout(() => {
          // Add directly to memory if not present
          const tasksInMemory = JSON.parse(localStorage.getItem('tasks-in-memory') || '[]');
          if (!tasksInMemory.includes(existingTask.id)) {
            console.log(`Task ${existingTask.id} exists in storage but not in memory, adding directly`);
            createTask(existingTask);
          }
          
          window.dispatchEvent(new Event('force-task-update'));
        }, 100);
        
        return existingTask.id;
      }
      
      // Generate a task ID - use UUID for guaranteed uniqueness
      const taskId = crypto.randomUUID();
      
      // Ensure we're storing the duration in seconds
      const durationInSeconds = typeof duration === 'number' ? duration : 1500;
      
      // Ensure templateId is valid
      const safeTemplateId = templateId || 'custom';
      
      const task: Task = {
        id: taskId,
        name,
        completed: false,
        duration: durationInSeconds, // Store in seconds
        createdAt: new Date().toISOString(),
        relationships: {
          habitId,
          templateId: safeTemplateId,
          date
        }
      };
      
      console.log(`Created task object for habit ${habitId} with ID ${taskId}:`, task);
      
      // Save directly to storage first to ensure persistence
      const savedToStorage = taskStorage.addTask(task);
      if (!savedToStorage) {
        console.log(`Task ${taskId} failed to save to storage, may already exist`);
        
        // Check if we have another task for this habit and date
        const existingCheck = taskStorage.taskExists(habitId, date);
        if (existingCheck) {
          console.log(`Found alternative task for habit ${habitId} on ${date}:`, existingCheck);
          return existingCheck.id;
        }
      }
      
      // Add task directly to state through the createTask function instead of just emitting an event
      // This ensures the task is immediately available in the UI
      createTask(task);
      
      // Add the Habit tag
      addTagToEntity('Habit', taskId, 'task');
      
      // Add template tag if available
      if (safeTemplateId && safeTemplateId !== 'custom') {
        // Format template name correctly with first letter capitalized
        let templateName = '';
        
        if (safeTemplateId.includes('-')) {
          // Handle kebab-case: "morning-routine" -> "Morning Routine"
          templateName = safeTemplateId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        } else {
          // Handle camelCase: "morningRoutine" -> "Morning Routine"
          templateName = safeTemplateId
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
      
      // Track the task in memory
      const tasksInMemory = JSON.parse(localStorage.getItem('tasks-in-memory') || '[]');
      if (!tasksInMemory.includes(taskId)) {
        tasksInMemory.push(taskId);
        localStorage.setItem('tasks-in-memory', JSON.stringify(tasksInMemory));
      }
      
      // Log success
      console.log(`Task created successfully for habit ${habitId}: ${taskId}`);
      
      // Force update with delay to ensure UI updates
      setTimeout(() => {
        forceTaskUpdate();
      }, 100);
      
      return taskId;
    } catch (error) {
      console.error('Error creating habit task:', error);
      toast.error('Failed to create habit task');
      return null;
    }
  }, [addTagToEntity, forceTaskUpdate, createTask]);
  
  return { createHabitTask };
};
