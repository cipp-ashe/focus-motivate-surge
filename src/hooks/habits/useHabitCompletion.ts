
import { useCallback } from 'react';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitEvents } from './useHabitEvents';

/**
 * Hook for handling habit completion actions
 */
export const useHabitCompletion = () => {
  const { completeHabit: emitHabitComplete } = useHabitEvents();

  // Complete a habit
  const completeHabit = useCallback((habitId: string, date: string) => {
    try {
      // Emit completion event with value=true
      emitHabitComplete(habitId, date, true);
      
      // Emit the legacy event format for backward compatibility
      eventManager.emit('habit:complete', { 
        habitId, 
        date, 
        value: true, // Add the missing value property
        completed: true 
      });
      
      return true;
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to complete habit');
      return false;
    }
  }, [emitHabitComplete]);

  // Dismiss a habit for today
  const dismissHabit = useCallback((habitId: string, date: string) => {
    try {
      // emit dismiss event
      eventManager.emit('habit:dismiss', { 
        habitId, 
        date,
        value: false, // Add value property for consistency
        dismissed: true 
      });
      return true;
    } catch (error) {
      console.error('Error dismissing habit:', error);
      toast.error('Failed to dismiss habit');
      return false;
    }
  }, []);

  return {
    completeHabit,
    dismissHabit
  };
};
