
import { useTaskEvents } from './useTaskEvents';
import { eventBus } from '@/lib/eventBus';

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
    eventBus.emit('tags:force-update' as any, {
      timestamp: new Date().toISOString()
    });
  };
  
  const checkPendingHabits = () => {
    console.log("checkPendingHabits called, emitting habits:check-pending event");
    eventBus.emit('habits:check-pending' as any, {});
  };
  
  return {
    forceTaskUpdate,
    forceTagsUpdate,
    checkPendingHabits
  };
};
