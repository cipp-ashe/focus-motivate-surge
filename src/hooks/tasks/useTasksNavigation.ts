
import { useCallback } from 'react';
import { useTaskEvents } from './useTaskEvents';
import { eventManager } from '@/lib/events/EventManager';
import { TimerEventType } from '@/types/events';

export const useTasksNavigation = () => {
  const { forceTaskUpdate, forceTagsUpdate, checkPendingHabits } = useTaskEvents();
  
  const navigateToTask = useCallback((taskId: string) => {
    eventManager.emit('task:select' as TimerEventType, taskId);
  }, []);
  
  const navigateToHabit = useCallback((habitId: string) => {
    // Cast the event type to TimerEventType to address type issues
    eventManager.emit('habit:select' as TimerEventType, habitId);
  }, []);
  
  return {
    navigateToTask,
    navigateToHabit,
    forceTaskUpdate, 
    forceTagsUpdate,
    checkPendingHabits
  };
};
