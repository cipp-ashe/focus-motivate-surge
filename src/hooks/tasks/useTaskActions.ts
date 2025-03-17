
import { useTaskEvents } from './useTaskEvents';
import { eventManager } from '@/lib/events/EventManager';

/**
 * A hook that provides task-related action methods
 * with backward compatibility for legacy code.
 */
export const useTaskActions = () => {
  const { forceTaskUpdate } = useTaskEvents();
  
  // Implement methods with clear, action-oriented names
  const forceTagsUpdate = () => {
    console.log("forceTagsUpdate called, forwarding to forceTaskUpdate");
    forceTaskUpdate();
    
    // Also emit a tags:force-update event for components that might be listening
    eventManager.emit('tags:force-update', {
      timestamp: new Date().toISOString()
    });
  };
  
  const checkPendingHabits = () => {
    console.log("checkPendingHabits called, emitting habits:check-pending event");
    eventManager.emit('habits:check-pending', {});
  };
  
  return {
    forceTaskUpdate,
    forceTagsUpdate,
    checkPendingHabits
  };
};

// Re-export the old name for backward compatibility
export { useTaskActions as useTasksTasks };
