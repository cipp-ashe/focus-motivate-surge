
import { useTaskEvents } from './useTaskEvents';
import { eventManager } from '@/lib/events/EventManager';

/**
 * A compatibility hook that provides task-related utilities to other hooks
 * with the expected method signatures from legacy code.
 */
export const useTasksTasks = () => {
  const { forceTaskUpdate } = useTaskEvents();
  
  // Implement the missing methods that are causing build errors
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
