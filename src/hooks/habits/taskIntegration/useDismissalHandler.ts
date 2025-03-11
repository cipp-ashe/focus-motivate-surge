import { useCallback, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook for managing dismissed habit tasks
 */
export const useDismissalHandler = () => {
  const dismissedHabitsRef = useRef<Map<string, string>>(new Map()); // Track dismissed habits for today
  
  /**
   * Loads dismissed habits from localStorage
   */
  const loadDismissedHabits = useCallback(() => {
    // Load previously dismissed habits from localStorage
    const storedDismissed = localStorage.getItem('dismissedHabitTasks');
    if (storedDismissed) {
      try {
        const dismissed = JSON.parse(storedDismissed);
        dismissedHabitsRef.current = new Map(Object.entries(dismissed));
        
        // Clean up old entries (only keep today's)
        const today = new Date().toDateString();
        Array.from(dismissedHabitsRef.current.keys()).forEach(key => {
          if (!key.includes(today)) {
            dismissedHabitsRef.current.delete(key);
          }
        });
        
        console.log(`Loaded ${dismissedHabitsRef.current.size} dismissed habits for today`);
      } catch (error) {
        console.error('Error loading dismissed habits:', error);
      }
    }
  }, []);
  
  /**
   * Checks if a habit is dismissed for today
   */
  const isHabitDismissed = useCallback((habitId: string, date: string) => {
    const habitKey = `${habitId}-${date}`;
    return dismissedHabitsRef.current.has(habitKey);
  }, []);
  
  /**
   * Marks a habit as dismissed for today
   */
  const markHabitDismissed = useCallback((habitId: string, date: string) => {
    const habitKey = `${habitId}-${date}`;
    
    console.log(`Marking habit ${habitId} as dismissed for ${date}`);
    dismissedHabitsRef.current.set(habitKey, new Date().toISOString());
    
    // Store dismissed habits in localStorage to persist across sessions
    const dismissedHabits = Object.fromEntries(dismissedHabitsRef.current.entries());
    localStorage.setItem('dismissedHabitTasks', JSON.stringify(dismissedHabits));
    
    // Emit event to mark habit as dismissed in the UI
    eventManager.emit('habit:dismissed', { habitId, date });
  }, []);
  
  /**
   * Handle habit task dismissed event
   */
  const handleHabitTaskDismissed = useCallback((event: CustomEvent) => {
    const { habitId, date } = event.detail;
    markHabitDismissed(habitId, date);
  }, [markHabitDismissed]);
  
  return {
    loadDismissedHabits,
    isHabitDismissed,
    markHabitDismissed,
    handleHabitTaskDismissed
  };
};
