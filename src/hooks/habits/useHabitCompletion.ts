
/**
 * Hook for habit completion functionality
 */

import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useHabitCompletion = () => {
  // Complete a habit and trigger appropriate events
  const completeHabit = useCallback((habitId: string, date: string, value: boolean | number = true) => {
    try {
      // Emit habit complete event
      eventManager.emit('habit:complete', {
        habitId,
        date,
        value
      });
      
      return true;
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to complete habit');
      return false;
    }
  }, []);

  // Dismiss a habit for today
  const dismissHabit = useCallback((habitId: string, date: string) => {
    try {
      // Emit habit dismiss event
      eventManager.emit('habit:dismiss', {
        habitId,
        date
      });
      
      return true;
    } catch (error) {
      console.error('Error dismissing habit:', error);
      toast.error('Failed to dismiss habit');
      return false;
    }
  }, []);

  // Create relationship between entities
  const createRelationship = useCallback((sourceId: string, targetId: string, type: string) => {
    try {
      // Emit event to create relationship
      eventManager.emit('tag:link', {
        tagId: crypto.randomUUID(), 
        entityId: sourceId,
        entityType: type,
      });
      
      return true;
    } catch (error) {
      console.error('Error creating relationship:', error);
      toast.error('Failed to link entities');
      return false;
    }
  }, []);

  // Navigation and UI helpers
  const navigateToTask = useCallback((taskId: string) => {
    try {
      // Emit event to navigate to task
      eventManager.emit('task:select', taskId);
      return true;
    } catch (error) {
      console.error('Error navigating to task:', error);
      return false;
    }
  }, []);

  const expandTimer = useCallback((taskId: string, taskName: string) => {
    try {
      // Emit event to expand timer
      eventManager.emit('timer:expand', {
        taskName: taskName
      });
      return true;
    } catch (error) {
      console.error('Error expanding timer:', error);
      return false;
    }
  }, []);

  return {
    completeHabit,
    dismissHabit,
    createRelationship,
    navigateToTask,
    expandTimer
  };
};
