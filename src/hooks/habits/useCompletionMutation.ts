
/**
 * Hook for handling habit completion mutations
 */
import { useState } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { HabitCompletionEvent } from '@/types/events/habit-events';
import { useToast } from '@/hooks/use-toast';

export function useCompletionMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const completeHabit = (payload: HabitCompletionEvent) => {
    setIsLoading(true);
    try {
      eventManager.emit('habit:complete', payload);
      
      // Show success toast
      if (payload.habitName) {
        toast({
          title: "Habit completed",
          description: `"${payload.habitName}" marked as completed.`,
          variant: "default",
        });
      }
      return true;
    } catch (error) {
      console.error("Error completing habit:", error);
      toast({
        title: "Error completing habit",
        description: "An error occurred while completing the habit.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    completeHabit,
    isLoading
  };
}
