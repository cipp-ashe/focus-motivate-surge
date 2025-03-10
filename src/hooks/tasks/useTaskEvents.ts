
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { TimerEventType } from '@/types/events';

export const useTaskEvents = () => {
  const forceTaskUpdate = () => {
    window.dispatchEvent(new Event('force-task-update'));
    eventBus.emit('tasks:force-update' as TimerEventType, { timestamp: new Date().toISOString() });
  };

  const forceTagsUpdate = () => {
    eventBus.emit('tags:force-update' as TimerEventType, { timestamp: new Date().toISOString() });
  };

  const checkPendingHabits = () => {
    eventBus.emit('habits:check-pending' as TimerEventType, null);
  };

  useEffect(() => {
    const handleHabitProcessed = () => {
      console.log("useTaskEvents: Habit processed, forcing task update");
      forceTaskUpdate();
    };
    
    eventBus.on('habits:processed' as TimerEventType, handleHabitProcessed);
    
    return () => {
      eventBus.off('habits:processed' as TimerEventType, handleHabitProcessed);
    };
  }, []);

  return { forceTaskUpdate, forceTagsUpdate, checkPendingHabits };
};
