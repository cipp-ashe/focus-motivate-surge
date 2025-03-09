
import { useState, useEffect } from 'react';
import { useHabitProgress } from '@/components/habits/hooks/useHabitProgress';
import { HabitDetail } from '@/components/habits/types';
import { relationshipManager } from '@/lib/relationshipManager';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

export const useHabitCompletion = (todaysHabits: HabitDetail[], templates: any[]) => {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const { updateProgress, getTodayProgress } = useHabitProgress();

  // Load completed habits from localStorage and relationships when habits change
  useEffect(() => {
    if (!todaysHabits.length) return;
    
    // Find habits that are already completed today based on relationships OR progress
    const completed: string[] = [];
    
    templates.forEach(template => {
      const templateId = template.templateId;
      todaysHabits.forEach(habit => {
        // Check if this habit has a related note (journal entry)
        const relatedNotes = relationshipManager.getRelatedEntities(habit.id, 'habit', 'note');
        const hasJournalEntry = relatedNotes.length > 0;
        
        // If there's a journal entry OR the progress shows completed, mark it as completed
        if (hasJournalEntry) {
          console.log(`Found related notes for habit ${habit.id}:`, relatedNotes);
          completed.push(habit.id);
          
          // Ensure the progress is updated to match the relationship
          updateProgress(habit.id, templateId, true);
        } else {
          // If no journal entry, check the stored progress
          const progress = getTodayProgress(habit.id, templateId);
          if (progress.completed) {
            completed.push(habit.id);
          }
        }
      });
    });
    
    if (completed.length > 0) {
      console.log("Found completed habits:", completed);
      setCompletedHabits(completed);
    }
  }, [todaysHabits, templates, getTodayProgress, updateProgress]);

  // Listen for events that could change completion status
  useEffect(() => {
    const handleJournalDeleted = ({ habitId }: { habitId: string }) => {
      setCompletedHabits(prev => prev.filter(id => id !== habitId));
    };
    
    const unsub = eventBus.on('habit:journal-deleted', handleJournalDeleted);
    return () => unsub();
  }, []);

  const handleHabitComplete = (habit: HabitDetail, templateId?: string) => {
    // If no templateId provided, find the template that contains this habit
    const actualTemplateId = templateId || templates.find(t => 
      t.habits.some(h => h.id === habit.id)
    )?.templateId;
    
    if (!actualTemplateId) {
      console.error("Could not find template for habit:", habit);
      toast.error("Error marking habit as complete");
      return;
    }

    // Check if there's an existing journal entry
    const relatedNotes = relationshipManager.getRelatedEntities(habit.id, 'habit', 'note');
    const hasJournalEntry = relatedNotes.length > 0;

    // Track locally for UI updates
    setCompletedHabits(prev => {
      if (prev.includes(habit.id)) {
        // If already completed and it's not a journal habit, mark as incomplete
        if (!hasJournalEntry && habit.metrics.type !== 'journal') {
          updateProgress(habit.id, actualTemplateId, false);
          return prev.filter(id => id !== habit.id);
        } 
        // If it's a journal habit or has a journal entry, don't allow unchecking directly
        return prev;
      } else {
        // If not completed, mark as complete
        updateProgress(habit.id, actualTemplateId, true);
        return [...prev, habit.id];
      }
    });
    
    console.log(`Marked habit ${habit.id} in template ${actualTemplateId} as complete`);
  };

  const handleAddHabitToTasks = (habit: HabitDetail) => {
    // This function would add the habit as a task
    toast.success(`Added "${habit.name}" to tasks`);
  };

  return {
    completedHabits,
    handleHabitComplete,
    handleAddHabitToTasks
  };
};
