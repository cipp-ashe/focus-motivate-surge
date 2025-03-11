
import { useState, useCallback, useEffect } from 'react';
import { HabitDetail } from '@/components/habits/types';
import { ActiveTemplate } from '@/components/habits/types';
import { useHabitRelationships } from './useHabitRelationships';
import { habitTaskOperations } from '@/lib/operations/tasks/habit';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useHabitCompletion = (todaysHabits: HabitDetail[], templates: ActiveTemplate[]) => {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [dismissedHabits, setDismissedHabits] = useState<string[]>([]);
  const { createTaskFromHabit, createJournalFromHabit } = useHabitRelationships();
  
  // Listen for habit dismissed events
  useEffect(() => {
    // When a habit task is dismissed, mark the habit as dismissed
    const handleHabitDismissed = (payload: { habitId: string; date: string }) => {
      const { habitId } = payload;
      console.log(`Marking habit ${habitId} as dismissed`);
      
      // Update dismissed habits list
      setDismissedHabits(prev => {
        if (prev.includes(habitId)) return prev;
        return [...prev, habitId];
      });
    };
    
    // Set up event listener
    const unsubscribe = eventManager.on('habit:dismissed', handleHabitDismissed);
    
    // Check localStorage for any already dismissed habits for today
    const storedDismissed = localStorage.getItem('dismissedHabitTasks');
    if (storedDismissed) {
      try {
        const dismissed = JSON.parse(storedDismissed);
        const today = new Date().toDateString();
        
        // Find habits dismissed today
        Object.entries(dismissed).forEach(([key, _]) => {
          if (key.includes(today)) {
            const [habitId] = key.split('-');
            if (habitId && todaysHabits.some(h => h.id === habitId)) {
              setDismissedHabits(prev => {
                if (prev.includes(habitId)) return prev;
                return [...prev, habitId];
              });
            }
          }
        });
      } catch (error) {
        console.error('Error loading dismissed habits:', error);
      }
    }
    
    return () => {
      unsubscribe();
    };
  }, [todaysHabits]);
  
  // Handle marking a habit as complete
  const handleHabitComplete = useCallback((habitId: string, completed: boolean) => {
    // Don't allow changing dismissed habits
    if (dismissedHabits.includes(habitId)) {
      return;
    }
    
    setCompletedHabits(prev => {
      const updated = new Set(prev);
      if (completed) {
        updated.add(habitId);
      } else {
        updated.delete(habitId);
      }
      return [...updated];
    });
    
    // Find the habit and its template
    const habit = todaysHabits.find(h => h.id === habitId);
    if (!habit) return;
    
    const templateId = habit.relationships?.templateId || '';
    
    // Emit event for habit completion
    eventManager.emit('habit:complete', {
      habitId,
      completed,
      date: new Date().toDateString(),
      templateId
    });
    
    toast.success(`Habit ${completed ? 'completed' : 'uncompleted'}: ${habit.name}`);
  }, [todaysHabits, dismissedHabits]);
  
  // Handle adding a habit to tasks
  const handleAddHabitToTasks = useCallback((habit: HabitDetail) => {
    // Get template ID from habit relationship
    const templateId = habit.relationships?.templateId || '';
    
    // Determine which type of task to create based on habit metrics type
    if (habit.metrics?.type === 'timer') {
      // Create a timer task
      const taskId = habitTaskOperations.createHabitTask(
        habit.id,
        templateId,
        habit.name,
        habit.metrics.target || 1500, // Default to 25 minutes if no target
        new Date().toDateString(),
        { 
          selectAfterCreate: true,
          taskType: 'timer' // Use timer task type
        }
      );
      
      if (taskId) {
        toast.success(`Added habit "${habit.name}" to timer tasks`);
      }
      return;
    } 
    else if (habit.metrics?.type === 'journal') {
      // Handle journal type habits
      createJournalFromHabit(habit, templateId);
      return;
    }
    // Fix type comparison - don't compare string literal 'checklist' with the habit metrics type
    else if (habit.metrics?.type && ['checklist', 'todo'].includes(habit.metrics.type)) {
      // Create a checklist task
      const taskId = habitTaskOperations.createHabitTask(
        habit.id,
        templateId,
        habit.name,
        0, // No duration needed
        new Date().toDateString(),
        { 
          selectAfterCreate: true,
          taskType: 'checklist'
        }
      );
      
      if (taskId) {
        toast.success(`Added habit "${habit.name}" to checklist tasks`);
      }
      return;
    }
    // Fix type comparison - don't compare string literal 'voicenote' with the habit metrics type
    else if (habit.metrics?.type && ['voicenote', 'audio'].includes(habit.metrics.type)) {
      // Create a voice note task
      const taskId = habitTaskOperations.createHabitTask(
        habit.id,
        templateId,
        habit.name,
        0, // No duration needed
        new Date().toDateString(),
        { 
          selectAfterCreate: true,
          taskType: 'voicenote'
        }
      );
      
      if (taskId) {
        toast.success(`Added habit "${habit.name}" to voice note tasks`);
      }
      return;
    }
    else {
      // For other habit types, create a regular task
      const taskId = habitTaskOperations.createHabitTask(
        habit.id,
        templateId,
        habit.name,
        0, // No duration for regular tasks
        new Date().toDateString(),
        { 
          selectAfterCreate: true,
          taskType: 'regular' // Use regular task type as default
        }
      );
      
      if (taskId) {
        toast.success(`Added habit "${habit.name}" to your regular tasks`);
      }
    }
  }, [createJournalFromHabit]);
  
  return {
    completedHabits,
    dismissedHabits,
    handleHabitComplete,
    handleAddHabitToTasks
  };
};
