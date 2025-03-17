
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

export const useTaskEvents = () => {
  const forceTaskUpdate = useCallback(() => {
    console.log("TaskEvents: Force updating task list (debounced)");
    
    // Force update via event
    window.dispatchEvent(new Event('force-task-update'));
    
    // Also emit via event manager
    eventManager.emit('task:reload', {});
  }, []);
  
  return {
    forceTaskUpdate
  };
};
