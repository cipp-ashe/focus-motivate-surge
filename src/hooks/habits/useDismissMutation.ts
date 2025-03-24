
/**
 * Hook for handling habit dismissal mutations
 */
import { useState } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useToast } from '@/hooks/use-toast';

export function useDismissMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const dismissHabit = (habitId: string, date: string, templateId?: string) => {
    setIsLoading(true);
    try {
      eventManager.emit('habit:dismiss', { habitId, date, templateId });
      
      // Show success toast
      toast({
        title: "Habit dismissed",
        description: "The habit has been marked as skipped for today.",
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error("Error dismissing habit:", error);
      toast({
        title: "Error dismissing habit",
        description: "An error occurred while dismissing the habit.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dismissHabit,
    isLoading
  };
}
