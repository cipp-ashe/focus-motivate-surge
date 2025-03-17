
import { useState, useEffect } from 'react';
import { useHabitProgress } from '@/components/habits/hooks/useHabitProgress';
import { HabitDetail } from '@/components/habits/types';
import { relationshipManager } from '@/lib/relationshipManager';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { EntityType } from '@/types/core';
import { RelationType } from '@/types/state';

export const useHabitCompletion = (todaysHabits: HabitDetail[], templates: any[]) => {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [dismissedHabits, setDismissedHabits] = useState<string[]>([]);
  const { updateProgress, getTodayProgress } = useHabitProgress();

  // Load completed habits from localStorage and relationships when habits change
  useEffect(() => {
    if (!todaysHabits.length) return;
    
    // Find habits that are already completed today based on relationships OR progress
    const completed: string[] = [];
    const dismissed: string[] = [];
    
    templates.forEach(template => {
      const templateId = template.templateId;
      todaysHabits.forEach(habit => {
        // Check if this habit has a related note (journal entry)
        const relatedNotes = relationshipManager.getRelatedEntities(habit.id, EntityType.Habit, EntityType.Note);
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
            // Check local storage for dismissed status
            const isDismissed = localStorage.getItem(`dismissed-habit-${habit.id}-${new Date().toDateString()}`);
            
            if (isDismissed) {
              dismissed.push(habit.id);
            }
            completed.push(habit.id);
          }
        }
      });
    });
    
    if (completed.length > 0) {
      console.log("Found completed habits:", completed);
      setCompletedHabits(completed);
    }
    
    if (dismissed.length > 0) {
      console.log("Found dismissed habits:", dismissed);
      setDismissedHabits(dismissed);
    }
  }, [todaysHabits, templates, getTodayProgress, updateProgress]);

  // Listen for events that could change completion status
  useEffect(() => {
    const handleJournalDeleted = ({ habitId }: { habitId: string }) => {
      setCompletedHabits(prev => prev.filter(id => id !== habitId));
      setDismissedHabits(prev => prev.filter(id => id !== habitId));
    };
    
    const handleTaskComplete = ({ taskId }: { taskId: string }) => {
      // Get the task relationships
      const relationships = relationshipManager.getRelationships(taskId, EntityType.Task);
      
      // Find habit relationships
      const habitRelationship = relationships.find(r => 
        r.relationType === 'habit-task' && r.targetId === taskId
      );
      
      if (habitRelationship) {
        const habitId = habitRelationship.sourceId;
        
        // Update completed habits
        setCompletedHabits(prev => {
          if (!prev.includes(habitId)) {
            // Find the template for this habit
            const template = templates.find(t => 
              t.habits.some(h => h.id === habitId)
            );
            
            if (template) {
              updateProgress(habitId, template.templateId, true);
              return [...prev, habitId];
            }
          }
          return prev;
        });
      }
    };
    
    // Listen for habit dismissed events
    const handleHabitDismissed = (data: { habitId: string, date: string }) => {
      const { habitId, date } = data;
      
      // Find the template for this habit
      const template = templates.find(t => 
        t.habits.some(h => h.id === habitId)
      );
      
      if (!template) return;
      
      // Mark as completed in the progress tracker
      updateProgress(habitId, template.templateId, true);
      
      // Store dismissal status in localStorage
      localStorage.setItem(`dismissed-habit-${habitId}-${date}`, 'true');
      
      // Update state for UI
      setCompletedHabits(prev => 
        prev.includes(habitId) ? prev : [...prev, habitId]
      );
      
      setDismissedHabits(prev => 
        prev.includes(habitId) ? prev : [...prev, habitId]
      );
      
      console.log(`Marked habit ${habitId} as dismissed for ${date}`);
    };
    
    // Connect to eventManager instead of eventBus
    const unsubJournal = eventManager.on('habit:journal-deleted', handleJournalDeleted);
    const unsubComplete = eventManager.on('task:complete', handleTaskComplete);
    const unsubDismissed = eventManager.on('habit:dismissed', handleHabitDismissed);
    
    return () => {
      unsubJournal();
      unsubComplete();
      unsubDismissed();
    };
  }, [templates, updateProgress]);

  const handleHabitComplete = (habitId: string, completed: boolean) => {
    // Find the habit object
    const habit = todaysHabits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Find the template for this habit
    const template = templates.find(t => 
      t.habits.some(h => h.id === habitId)
    );
    
    if (!template) {
      console.error("Could not find template for habit:", habitId);
      toast.error("Error marking habit as complete");
      return;
    }

    // Check if this habit is dismissed
    const isDismissed = dismissedHabits.includes(habitId);

    // If trying to mark a dismissed habit as incomplete, we need to clear the dismissal first
    if (isDismissed && !completed) {
      setDismissedHabits(prev => prev.filter(id => id !== habitId));
      localStorage.removeItem(`dismissed-habit-${habitId}-${new Date().toDateString()}`);
    }

    // Check if there's an existing journal entry
    const relatedNotes = relationshipManager.getRelatedEntities(habitId, EntityType.Habit, EntityType.Note);
    const hasJournalEntry = relatedNotes.length > 0;

    // Track locally for UI updates
    setCompletedHabits(prev => {
      if (prev.includes(habitId)) {
        // If already completed and it's not a journal habit, mark as incomplete
        if (!hasJournalEntry && habit.metrics.type !== 'journal') {
          updateProgress(habitId, template.templateId, false);
          return prev.filter(id => id !== habitId);
        } 
        // If it's a journal habit or has a journal entry, don't allow unchecking directly
        return prev;
      } else {
        // If not completed, mark as complete
        updateProgress(habitId, template.templateId, true);
        return [...prev, habitId];
      }
    });
    
    console.log(`Marked habit ${habitId} in template ${template.templateId} as ${completed ? 'complete' : 'incomplete'}`);
  };

  const handleAddHabitToTasks = (habit: HabitDetail) => {
    // Only timer-based habits can be added as tasks
    if (habit.metrics.type !== 'timer') {
      toast.error("Only timer-based habits can be added as tasks");
      return;
    }
    
    // Find template for this habit
    const template = templates.find(t => 
      t.habits.some(h => h.id === habit.id)
    );
    
    if (!template) {
      toast.error("Could not find template for habit");
      return;
    }
    
    // Create a new task for this habit
    const today = new Date().toDateString();
    const taskId = crypto.randomUUID();
    const duration = habit.metrics.target || 1500; // Default to 25 minutes if no target set
    
    const task = {
      id: taskId,
      name: habit.name,
      description: habit.description,
      completed: false,
      duration,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId: habit.id,
        templateId: template.templateId,
        date: today
      }
    };
    
    // Create the task via eventManager
    eventManager.emit('task:create', task);
    
    // Add the Habit tag
    eventManager.emit('tag:link', {
      tagId: 'Habit',
      entityId: taskId,
      entityType: 'task'
    });
    
    // Create relationship
    eventManager.emit('relationship:create', {
      sourceId: habit.id,
      sourceType: EntityType.Habit,
      targetId: taskId,
      targetType: EntityType.Task,
      relationType: 'habit-task' as RelationType
    });
    
    // Select the task and start the timer
    eventManager.emit('task:select', taskId);
    
    // Send timer events
    setTimeout(() => {
      eventManager.emit('timer:start', { 
        taskName: task.name, 
        duration: task.duration
      });
      
      // Expand timer view
      eventManager.emit('timer:expand', { taskName: task.name });
    }, 100);
    
    toast.success(`Added "${habit.name}" to tasks and started timer`);
  };

  return {
    completedHabits,
    dismissedHabits,
    handleHabitComplete,
    handleAddHabitToTasks
  };
};
