
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';

export const useTaskEvents = () => {
  const forceTaskUpdate = () => {
    window.dispatchEvent(new Event('force-task-update'));
    eventBus.emit('task:reload', { type: 'force-update' });
  };

  useEffect(() => {
    const handleHabitProcessed = () => {
      console.log("useTaskEvents: Habit processed, forcing task update");
      forceTaskUpdate();
    };
    
    eventBus.on('habits:processed', handleHabitProcessed);
    
    return () => {
      eventBus.off('habits:processed', handleHabitProcessed);
    };
  }, []);

  return { forceTaskUpdate };
};
