
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { HabitDetail } from '@/components/habits/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to manage relationships between habits and other entities like tasks and journal entries
 */
export const useHabitRelationships = () => {
  /**
   * Create a task from a habit
   */
  const createTaskFromHabit = useCallback((habit: HabitDetail, templateId: string) => {
    if (!habit.metrics?.type === 'timer') {
      console.warn('Cannot create a task for non-timer habit');
      return null;
    }
    
    const today = new Date().toDateString();
    const taskId = uuidv4();
    const duration = habit.metrics?.target || 1500; // Default to 25 minutes
    
    // Schedule task creation via event bus
    eventBus.emit('habit:schedule', {
      habitId: habit.id,
      templateId,
      name: habit.name,
      duration,
      date: today
    });
    
    toast.success(`Added habit "${habit.name}" to tasks`);
    
    return taskId;
  }, []);
  
  /**
   * Create a journal entry from a habit
   */
  const createJournalFromHabit = useCallback((habit: HabitDetail, templateId: string) => {
    if (habit.metrics?.type !== 'journal') {
      console.warn('Cannot create a journal for non-journal habit');
      return null;
    }
    
    // Open the journal modal
    eventBus.emit('journal:open', {
      habitId: habit.id,
      habitName: habit.name,
      templateId
    });
    
    return true;
  }, []);
  
  return {
    createTaskFromHabit,
    createJournalFromHabit
  };
};
