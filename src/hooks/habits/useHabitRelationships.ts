
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { HabitDetail } from '@/components/habits/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Define the event payload type
interface JournalOpenEventPayload {
  habitId: string;
  habitName: string;
  templateId: string;
}

/**
 * Hook to manage relationships between habits and other entities like tasks and journal entries
 */
export const useHabitRelationships = () => {
  /**
   * Create a task from a habit
   */
  const createTaskFromHabit = useCallback((habit: HabitDetail, templateId: string) => {
    // Fix comparison error: check if habit metrics type is not 'timer'
    if (habit.metrics?.type !== 'timer') {
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
    
    // Fix error: Add templateId to the journal:open event payload
    const payload: JournalOpenEventPayload = {
      habitId: habit.id,
      habitName: habit.name,
      templateId // Add templateId to the payload
    };
    
    eventBus.emit('journal:open', payload);
    
    return true;
  }, []);
  
  return {
    createTaskFromHabit,
    createJournalFromHabit
  };
};
