
import { useEffect, useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { relationshipManager } from '@/lib/relationshipManager';
import { toast } from 'sonner';

export const useHabitRelationships = () => {
  // Track relationships between habits and other entities
  useEffect(() => {
    // Handle relationships when templates are deleted
    const handleTemplateDelete = ({ templateId }: { templateId: string }) => {
      console.log(`Template deletion detected for ${templateId}, cleaning up relationships`);
      
      // Find all relationships related to this template
      const templateRelationships = relationshipManager.getRelationshipsByType('template-habit');
      
      // Find habit IDs that are related to this template
      const habitIds = templateRelationships
        .filter(rel => rel.sourceId === templateId)
        .map(rel => rel.targetId);
      
      console.log(`Found ${habitIds.length} habits related to template ${templateId}`);
      
      // For each habit, clean up all related entities
      habitIds.forEach(habitId => {
        // Find related tasks
        const relatedTasks = relationshipManager.getRelatedEntities(habitId, 'habit', 'task');
        console.log(`Found ${relatedTasks.length} tasks related to habit ${habitId}`);
        
        // Delete each related task
        relatedTasks.forEach(task => {
          console.log(`Deleting task ${task.id} linked to habit ${habitId}`);
          eventBus.emit('task:delete', { taskId: task.id, reason: 'template-deleted' });
        });
        
        // Find related notes (journal entries)
        const relatedNotes = relationshipManager.getRelatedEntities(habitId, 'habit', 'note');
        console.log(`Found ${relatedNotes.length} notes related to habit ${habitId}`);
        
        // Delete each related note
        relatedNotes.forEach(note => {
          console.log(`Deleting note ${note.id} linked to habit ${habitId}`);
          eventBus.emit('note:delete', { noteId: note.id, reason: 'template-deleted' });
        });
        
        // Emit event to update any components displaying this habit
        eventBus.emit('habit:deleted', { habitId, templateId });
      });
    };
    
    // Listen for template deletion events
    const unsubTemplateDelete = eventBus.on('habit:template-delete', handleTemplateDelete);
    
    return () => {
      unsubTemplateDelete();
    };
  }, []);

  // Create a task from a habit
  const createTaskFromHabit = useCallback((habit: any, templateId: string) => {
    // Only timer-based habits can be added as tasks
    if (habit.metrics.type !== 'timer') {
      toast.error("Only timer-based habits can be added as tasks");
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
        templateId,
        date: today
      }
    };
    
    // Create the task
    eventBus.emit('task:create', task);
    
    // Add the Habit tag
    eventBus.emit('tag:link', {
      tagId: 'Habit',
      entityId: taskId,
      entityType: 'task'
    });
    
    // Create relationship
    eventBus.emit('relationship:create', {
      sourceId: habit.id,
      sourceType: 'habit',
      targetId: taskId,
      targetType: 'task',
      relationType: 'habit-task'
    });
    
    // Select the task and start the timer
    eventBus.emit('task:select', taskId);
    
    // Send timer events
    setTimeout(() => {
      eventBus.emit('timer:start', { 
        taskName: task.name, 
        duration: task.duration
      });
      
      // Expand timer view
      eventBus.emit('timer:expand', { taskName: task.name });
    }, 100);
    
    toast.success(`Added "${habit.name}" to tasks and started timer`);
    
    return taskId;
  }, []);

  // Create a journal entry from a habit
  const createJournalFromHabit = useCallback((habit: any, templateId: string) => {
    // Create a new note for this habit
    const today = new Date().toISOString();
    const noteId = crypto.randomUUID();
    
    const note = {
      id: noteId,
      title: `${habit.name} - ${new Date().toLocaleDateString()}`,
      content: '',
      createdAt: today,
      updatedAt: today,
      color: 'blue',
      pinned: false,
      relationships: {
        habitId: habit.id,
        templateId
      }
    };
    
    // Create the note
    eventBus.emit('note:create', note);
    
    // Create relationship
    eventBus.emit('relationship:create', {
      sourceId: habit.id,
      sourceType: 'habit',
      targetId: noteId,
      targetType: 'note',
      relationType: 'habit-journal'
    });
    
    // Add the Journal tag
    eventBus.emit('tag:link', {
      tagId: 'Journal',
      entityId: noteId,
      entityType: 'note'
    });
    
    // Emit event for other components
    eventBus.emit('habit:journal-create', { habitId: habit.id, templateId, noteId });
    
    toast.success(`Created journal entry for "${habit.name}"`);
    
    return noteId;
  }, []);

  return {
    createTaskFromHabit,
    createJournalFromHabit
  };
};
