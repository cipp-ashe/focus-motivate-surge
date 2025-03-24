
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useNoteActions, useNoteState } from '@/contexts/notes/hooks';
import { Note } from '@/types/notes';
import { toast } from 'sonner';
import { EntityType } from '@/types/core';
import { JournalEntry } from '@/types/events/journal-events';

/**
 * Core service hook for journal entries
 * Acts as the single source of truth for journal operations
 */
export const useJournalService = () => {
  const { notes } = useNoteState();
  const { addNote, updateNote, deleteNote, loadNotes } = useNoteActions();

  /**
   * Find a journal entry by various criteria
   */
  const findJournalEntry = useCallback((
    criteria: {
      id?: string;
      habitId?: string;
      taskId?: string;
      date?: string;
    }
  ): Note | undefined => {
    return notes.find(note => {
      // First try to match by ID
      if (criteria.id && note.id === criteria.id) {
        return true;
      }

      // Then try to match by relationships
      if (note.relationships) {
        // Match by task ID
        if (criteria.taskId && 
            note.relationships.some(rel => 
              rel.entityId === criteria.taskId && 
              rel.entityType === EntityType.Task
            )) {
          return true;
        }

        // Match by habit ID
        if (criteria.habitId && 
            note.relationships.some(rel => 
              rel.entityId === criteria.habitId && 
              rel.entityType === EntityType.Habit
            )) {
          // If date is provided, also check the date
          if (criteria.date) {
            return note.relationships.some(rel => 
              rel.metadata?.date === criteria.date
            );
          }
          return true;
        }
      }

      // Check journal tag
      if (note.tags && note.tags.some(tag => tag.name === 'journal')) {
        return true;
      }

      return false;
    });
  }, [notes]);

  /**
   * Create a new journal entry
   */
  const createJournalEntry = useCallback((
    payload: {
      habitId?: string;
      habitName?: string;
      taskId?: string;
      templateId?: string;
      title?: string;
      content?: string;
      date?: string;
      tags?: string[];
    }
  ): string => {
    const { 
      habitId, 
      habitName, 
      taskId, 
      templateId, 
      title = habitName ? `Journal: ${habitName}` : 'Journal Entry',
      content = '',
      date = new Date().toISOString(),
      tags = []
    } = payload;

    // Check if entry already exists
    const existingEntry = findJournalEntry({
      habitId,
      taskId, 
      date: date.split('T')[0]
    });

    if (existingEntry) {
      // Update existing entry
      updateNote(existingEntry.id, {
        title,
        content,
        updatedAt: new Date().toISOString()
      });

      // Update task if needed
      if (taskId) {
        eventManager.emit('task:update', {
          taskId,
          updates: {
            journalEntry: content,
            completed: true,
            completedAt: new Date().toISOString()
          }
        });
      }

      toast.success('Journal entry updated');
      return existingEntry.id;
    } 
    
    // Create new entry
    const id = `journal-${habitId || taskId || Date.now()}-${date.split('T')[0]}`;

    // Create relationships
    const relationships = [];
    
    if (habitId) {
      relationships.push({
        entityId: habitId,
        entityType: EntityType.Habit,
        metadata: { templateId, date }
      });
    }

    if (taskId) {
      relationships.push({
        entityId: taskId,
        entityType: EntityType.Task
      });
    }

    // Create standard tags
    const noteTags = [{ name: 'journal', color: 'green' }];
    
    // Add custom tags
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        if (!noteTags.some(t => t.name === tag)) {
          noteTags.push({ name: tag, color: 'default' });
        }
      });
    }

    // Create the note
    const newNote: Omit<Note, 'id'> = {
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: noteTags,
      relationships
    };

    addNote({ id, ...newNote });

    // Update task if needed
    if (taskId) {
      eventManager.emit('task:update', {
        taskId,
        updates: {
          journalEntry: content,
          completed: true,
          completedAt: new Date().toISOString()
        }
      });
    }

    toast.success('Journal entry created');
    return id;
  }, [findJournalEntry, updateNote, addNote]);

  /**
   * Update an existing journal entry
   */
  const updateJournalEntry = useCallback((
    id: string,
    updates: Partial<JournalEntry>
  ): boolean => {
    // Find the journal entry
    const entry = findJournalEntry({ id });
    
    if (!entry) {
      console.error(`Journal entry with ID ${id} not found`);
      return false;
    }
    
    // Update the note
    updateNote(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    // If there's a task ID in the relationships, update the task's journal entry
    const taskRelationship = entry.relationships?.find(rel => 
      rel.entityType === EntityType.Task
    );
    
    if (taskRelationship && updates.content) {
      eventManager.emit('task:update', {
        taskId: taskRelationship.entityId,
        updates: {
          journalEntry: updates.content
        }
      });
    }
    
    return true;
  }, [findJournalEntry, updateNote]);

  /**
   * Delete a journal entry
   */
  const deleteJournalEntry = useCallback((
    id: string
  ): boolean => {
    // Find the journal entry
    const entry = findJournalEntry({ id });
    
    if (!entry) {
      console.error(`Journal entry with ID ${id} not found`);
      return false;
    }
    
    // Delete the note
    deleteNote(id);
    
    // If there's a task ID in the relationships, update the task's journal entry
    const taskRelationship = entry.relationships?.find(rel => 
      rel.entityType === EntityType.Task
    );
    
    if (taskRelationship) {
      eventManager.emit('task:update', {
        taskId: taskRelationship.entityId,
        updates: {
          journalEntry: ''
        }
      });
    }
    
    return true;
  }, [findJournalEntry, deleteNote]);

  /**
   * Open journal entry for editing
   */
  const openJournalEntry = useCallback((payload: {
    habitId?: string;
    habitName?: string;
    description?: string;
    templateId?: string;
    taskId?: string;
    date?: string;
    content?: string;
  }) => {
    console.log('Opening journal entry:', payload);
    eventManager.emit('journal:open', payload);
  }, []);

  /**
   * Handle task completion for a journal habit task
   */
  const handleJournalTaskCompletion = useCallback((taskId: string, taskData: {
    name: string;
    journalEntry?: string;
    relationships?: {
      habitId?: string;
      templateId?: string;
      date?: string;
    }
  }) => {
    if (!taskData.journalEntry) return;
    
    createJournalEntry({
      habitId: taskData.relationships?.habitId,
      habitName: taskData.name,
      taskId,
      templateId: taskData.relationships?.templateId,
      content: taskData.journalEntry,
      date: taskData.relationships?.date
    });
  }, [createJournalEntry]);

  // Set up event listeners
  const setupEventListeners = useCallback(() => {
    // This is meant to be called in a useEffect in a component
    const createUnsubscribe = eventManager.on('journal:create', createJournalEntry);
    const updateUnsubscribe = eventManager.on('journal:update', 
      ({ id, updates }) => updateJournalEntry(id, updates)
    );
    const deleteUnsubscribe = eventManager.on('journal:delete', 
      ({ id }) => deleteJournalEntry(id)
    );
    const openUnsubscribe = eventManager.on('journal:open', openJournalEntry);
    
    // Return cleanup function
    return () => {
      createUnsubscribe();
      updateUnsubscribe();
      deleteUnsubscribe();
      openUnsubscribe();
    };
  }, [createJournalEntry, updateJournalEntry, deleteJournalEntry, openJournalEntry]);

  return {
    findJournalEntry,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    openJournalEntry,
    handleJournalTaskCompletion,
    setupEventListeners,
    loadJournalEntries: loadNotes, // Alias for convenience
    journalEntries: notes.filter(note => 
      note.tags?.some(tag => tag.name === 'journal')
    )
  };
};
