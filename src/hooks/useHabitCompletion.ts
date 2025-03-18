
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useHabitCompletion = () => {
  const createRelationship = useCallback((sourceId: string, targetId: string, type: string) => {
    try {
      // Emit event to create relationship
      eventManager.emit('tag:link', {
        id: crypto.randomUUID(),
        type,
        sourceId,
        targetId
      });
      
      return true;
    } catch (error) {
      console.error('Error creating relationship:', error);
      toast.error('Failed to link entities');
      return false;
    }
  }, []);

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
        taskId,
        taskName
      });
      return true;
    } catch (error) {
      console.error('Error expanding timer:', error);
      return false;
    }
  }, []);

  return {
    createRelationship,
    navigateToTask,
    expandTimer
  };
};
