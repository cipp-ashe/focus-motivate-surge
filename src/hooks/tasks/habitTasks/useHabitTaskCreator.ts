
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { useTagSystem } from '@/hooks/useTagSystem';
import { useTaskEvents } from '../useTaskEvents';

/**
 * Hook for creating habit tasks
 */
export const useHabitTaskCreator = () => {
  const { addTagToEntity } = useTagSystem();
  const { forceTaskUpdate } = useTaskEvents();
  
  /**
   * Create a new task for a habit
   */
  const createHabitTask = useCallback((
    habitId: string, 
    templateId: string, 
    name: string, 
    duration: number, 
    date: string
  ) => {
    console.log(`Creating new task for habit ${habitId}:`, { name, duration });
    
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

    // Store task directly in localStorage first to ensure persistence
    const currentTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    
    // Check if the task already exists by ID or by habit relationship
    const existingTask = currentTasks.find((t: Task) => 
      t.id === task.id || 
      (t.relationships?.habitId === habitId && t.relationships?.date === date)
    );
    
    if (!existingTask) {
      // Add task to localStorage directly
      const updatedTasks = [...currentTasks, task];
      localStorage.setItem('taskList', JSON.stringify(updatedTasks));
      console.log('Directly added task to localStorage:', task);
      
      // Create the task via event bus after localStorage is updated
      eventBus.emit('task:create', task);
      
      // Add the Habit tag
      addTagToEntity('Habit', taskId, 'task');
      
      // Add template tag if available (e.g., "Mindfulness")
      if (templateId) {
        // Format template name correctly with first letter capitalized
        // Handles both camelCase and kebab-case formats
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
            // Insert a space before all capital letters
            .replace(/([A-Z])/g, ' $1')
            // Capitalize the first letter
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
      
      // Force a UI update with a slight delay to ensure everything is processed
      setTimeout(() => {
        // Force a global task update
        window.dispatchEvent(new Event('force-task-update'));
        forceTaskUpdate();
        console.log('Forced task update after creating task from habit');
      }, 300);
    } else {
      console.log('Task already exists, skipping creation:', existingTask);
      return existingTask.id;
    }
    
    return taskId;
  }, [addTagToEntity, forceTaskUpdate]);
  
  return { createHabitTask };
};
