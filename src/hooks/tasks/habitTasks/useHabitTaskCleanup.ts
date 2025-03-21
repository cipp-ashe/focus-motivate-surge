
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { TaskEventType } from '@/lib/events/types';

/**
 * Hook for handling cleanup of habit tasks
 */
export const useHabitTaskCleanup = () => {
  /**
   * Deletes a habit task and notifies related systems
   * 
   * @param habitId ID of the habit
   * @param date Date of the habit task
   * @param taskId Optional ID of the associated task
   * @returns Promise that resolves when cleanup is complete
   */
  const deleteHabitTask = useCallback(async (
    habitId: string,
    date: string,
    taskId?: string
  ): Promise<void> => {
    try {
      console.log(`Deleting habit task for habit ${habitId} on ${date}`);
      
      // Ensure taskId is always provided (use empty string if not available)
      const finalTaskId = taskId || '';
      
      // First, emit the habit:task-deleted event with the corrected payload structure
      const payload = { 
        habitId, 
        taskId: finalTaskId,
        date
      };
      
      eventManager.emit('habit:task-deleted', payload);
      
      // If we have the taskId, also trigger the standard task deletion process
      if (taskId) {
        eventManager.emit('task:delete' as TaskEventType, { 
          taskId,
          reason: 'habit-cleanup'
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting habit task:', error);
      return Promise.reject(error);
    }
  }, []);
  
  return {
    deleteHabitTask
  };
};
