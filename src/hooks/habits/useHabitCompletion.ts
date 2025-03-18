
import { useCallback } from 'react';
import { format } from 'date-fns';
import { HabitStats, HabitLog } from '@/types/habit';
import { eventManager } from '@/lib/events/EventManager';
import { computeHabitStreak } from '@/utils/habits/streakCalculator';
import { toast } from 'sonner';

export const useHabitCompletion = () => {
  const completeHabit = useCallback((habitId: string, date: string) => {
    try {
      // Format the completion date for display
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');
      
      // Emit event to mark habit as completed for the given date
      eventManager.emit('habit:complete', {
        habitId,
        date: formattedDate
      });
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to mark habit as completed');
      return false;
    }
  }, []);

  const dismissHabit = useCallback((habitId: string, date: string) => {
    try {
      // Format the dismissal date for display
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');
      
      // Emit event to mark habit as dismissed for the given date
      eventManager.emit('habit:dismissed', {
        habitId,
        date: formattedDate,
      });
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error dismissing habit:', error);
      toast.error('Failed to dismiss habit');
      return false;
    }
  }, []);

  const getHabitStats = useCallback((logs: HabitLog[]): HabitStats => {
    // Calculate streak from logs
    const streak = computeHabitStreak(logs);
    
    // Calculate completion rate
    const totalDays = logs.length;
    const completedDays = logs.filter(log => log.completed).length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    
    return {
      streak,
      completionRate: Math.round(completionRate),
      totalDays,
      completedDays
    };
  }, []);

  return {
    completeHabit,
    dismissHabit,
    getHabitStats
  };
};
