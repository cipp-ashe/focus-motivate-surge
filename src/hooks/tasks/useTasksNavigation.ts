
import { useCallback } from 'react';
import { useTaskEvents } from './useTaskEvents';
import { eventManager } from '@/lib/events/EventManager';

export const useTasksNavigation = () => {
  const { forceTaskUpdate } = useTaskEvents();
  
  const navigateToTask = useCallback((taskId: string) => {
    eventManager.emit('task:select', taskId);
  }, []);
  
  const navigateToHabit = useCallback((habitId: string) => {
    eventManager.emit('habit:select', { habitId });
  }, []);
  
  return {
    navigateToTask,
    navigateToHabit,
    forceTaskUpdate
  };
};
