
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { HabitDetail, ActiveTemplate } from '@/components/habits/types';

export const useHabitCompletion = (todaysHabits: HabitDetail[], templates: ActiveTemplate[]) => {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  // Load completed habits from localStorage
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressData = JSON.parse(localStorage.getItem('habit-progress') || '{}');
      const todayProgress = progressData[today] || {};
      
      // Collect IDs of completed habits
      const completed = Object.entries(todayProgress)
        .filter(([_, value]) => (value as any).completed)
        .map(([id]) => id);
      
      setCompletedHabits(completed);
      
      // Check for related journal entries that would mark habits as complete
      todaysHabits.forEach(habit => {
        if (habit.metrics.type === 'journal') {
          const notes = JSON.parse(localStorage.getItem('notes') || '[]');
          const hasRelatedNote = notes.some((note: any) => 
            note.relationships?.habitId === habit.id && 
            new Date(note.created).toISOString().split('T')[0] === today
          );
          
          if (hasRelatedNote && !completed.includes(habit.id)) {
            handleHabitComplete(habit);
          }
        }
      });
    } catch (error) {
      console.error('Error loading habit progress:', error);
    }
  }, [todaysHabits]);

  // Listen for journal deletion events
  useEffect(() => {
    const handleJournalDeleted = ({ habitId }: { habitId: string }) => {
      setCompletedHabits(prev => prev.filter(id => id !== habitId));
      
      // Also update localStorage
      try {
        const today = new Date().toISOString().split('T')[0];
        const progressData = JSON.parse(localStorage.getItem('habit-progress') || '{}');
        if (progressData[today] && progressData[today][habitId]) {
          progressData[today][habitId].completed = false;
          localStorage.setItem('habit-progress', JSON.stringify(progressData));
        }
      } catch (error) {
        console.error('Error updating habit progress after journal deletion:', error);
      }
    };
    
    eventBus.on('journal:deleted', handleJournalDeleted);
    return () => {
      eventBus.off('journal:deleted', handleJournalDeleted);
    };
  }, []);

  const handleHabitComplete = (habit: HabitDetail, templateId?: string) => {
    const habitId = habit.id;
    
    // Toggle completion status
    const isCompleted = completedHabits.includes(habitId);
    
    // If switching from complete to incomplete and it's a journal type,
    // we need to check if a journal entry exists
    if (isCompleted && habit.metrics.type === 'journal') {
      const today = new Date().toISOString().split('T')[0];
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const hasRelatedNote = notes.some((note: any) => 
        note.relationships?.habitId === habitId && 
        new Date(note.created).toISOString().split('T')[0] === today
      );
      
      if (hasRelatedNote) {
        toast.error("Cannot unmark a habit with a journal entry. Delete the journal entry first.");
        return;
      }
    }
    
    if (isCompleted) {
      setCompletedHabits(prev => prev.filter(id => id !== habitId));
    } else {
      setCompletedHabits(prev => [...prev, habitId]);
      
      // If it's a journal type, open the journal entry dialog
      if (habit.metrics.type === 'journal') {
        eventBus.emit('journal:create', { 
          habitId, 
          templateId, 
          habitName: habit.name 
        });
        return; // Don't mark as completed yet - will be marked when journal is saved
      } else {
        toast.success(`Habit "${habit.name}" completed!`);
      }
    }
    
    // Update localStorage progress
    try {
      const today = new Date().toISOString().split('T')[0];
      const progressData = JSON.parse(localStorage.getItem('habit-progress') || '{}');
      
      if (!progressData[today]) {
        progressData[today] = {};
      }
      
      progressData[today][habitId] = {
        completed: !isCompleted,
        value: !isCompleted,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('habit-progress', JSON.stringify(progressData));
      
      // Dispatch event to update UI
      window.dispatchEvent(new Event('habitProgressUpdated'));
    } catch (error) {
      console.error('Error updating habit progress:', error);
    }
  };

  const handleAddHabitToTasks = (habit: HabitDetail) => {
    const templateId = templates.find(t => 
      t.habits.some(h => h.id === habit.id)
    )?.templateId;
    
    // If it's a timer habit, create a task for it
    if (habit.metrics.type === 'timer') {
      eventBus.emit('habit:schedule', {
        habitId: habit.id,
        templateId,
        duration: habit.metrics.target || 25,
        name: habit.name,
        date: new Date().toDateString()
      });
      
      toast.success(`Added "${habit.name}" to tasks!`);
    }
  };

  return { 
    completedHabits, 
    handleHabitComplete, 
    handleAddHabitToTasks 
  };
};
