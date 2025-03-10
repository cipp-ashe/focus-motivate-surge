
import { useTaskEvents } from './useTaskEvents';

/**
 * Simple compatibility hook to provide task-related utilities to other hooks
 * that expect different method signatures.
 */
export const useTasksTasks = () => {
  const { forceTaskUpdate } = useTaskEvents();
  
  // Provide stub implementations for deprecated methods
  const forceTagsUpdate = () => {
    console.log("forceTagsUpdate is deprecated, using forceTaskUpdate instead");
    forceTaskUpdate();
  };
  
  const checkPendingHabits = () => {
    console.log("checkPendingHabits is deprecated, emitting habits:check-pending event");
    window.dispatchEvent(new CustomEvent('habits:check-pending'));
  };
  
  return {
    forceTaskUpdate,
    forceTagsUpdate,
    checkPendingHabits
  };
};
