
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { eventManager } from '@/lib/events/EventManager';
import { TimerEventType } from '@/types/events';

export const useTaskEvents = () => {
  const forceTaskUpdate = useCallback(() => {
    console.log("TaskEvents: Force updating task list (debounced)");
    
    // Force update via event
    window.dispatchEvent(new Event('force-task-update'));
    
    // Also emit via event bus for components using that system
    eventBus.emit('task:reload', {});
    
    // And via event manager
    eventManager.emit('task:reload' as TimerEventType, {});
  }, []);
  
  return {
    forceTaskUpdate
  };
};
