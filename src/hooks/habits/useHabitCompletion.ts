
import { useState, useCallback } from 'react';
import { HabitDetail } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';
import { useHabitRelationships } from './useHabitRelationships';
import { toast } from 'sonner';

/**
 * Hook to manage habit completion state and actions
 */
export const useHabitCompletion = (todaysHabits: HabitDetail[], templates: any[]) => {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const { createTaskFromHabit, createJournalFromHabit } = useHabitRelationships();
  
  // Handle habit completion toggle
  const handleHabitComplete = useCallback((habit: HabitDetail, templateId?: string) => {
    setCompletedHabits(prev => {
      if (prev.includes(habit.id)) {
        // Uncomplete the habit
        return prev.filter(id => id !== habit.id);
      } else {
        // Complete the habit
        
        // If it's a journal habit, we need to open the journal modal
        if (habit.metrics?.type === 'journal') {
          eventBus.emit('journal:open', { 
            habitId: habit.id, 
            habitName: habit.name,
            templateId
          });
          // Don't mark as completed yet - will be completed when journal entry is saved
          return prev;
        }
        
        // Mark as completed
        toast.success(`Completed habit: ${habit.name}`);
        return [...prev, habit.id];
      }
    });
  }, []);
  
  // Handle adding a habit to tasks
  const handleAddHabitToTasks = useCallback((habit: HabitDetail) => {
    const templateId = habit.relationships?.templateId;
    
    if (habit.metrics?.type === 'timer') {
      const taskId = createTaskFromHabit(habit, templateId || 'custom');
      
      if (taskId) {
        // Force update task list
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 100);
      }
    } else if (habit.metrics?.type === 'journal') {
      createJournalFromHabit(habit, templateId || 'custom');
    }
  }, [createTaskFromHabit, createJournalFromHabit]);
  
  return {
    completedHabits,
    handleHabitComplete,
    handleAddHabitToTasks
  };
};
