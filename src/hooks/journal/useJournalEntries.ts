
import { useCallback, useState, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useNoteActions, useNoteState } from '@/contexts/notes/hooks';
import { Note } from '@/types/notes';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';

/**
 * Hook for managing journal entries, which are essentially notes with specific tags
 * that are associated with habits and tasks
 */
export const useJournalEntries = () => {
  const { notes } = useNoteState();
  const { addNote, updateNote } = useNoteActions();
  const [journalEntries, setJournalEntries] = useState<Note[]>([]);
  
  // Find notes that are journal entries (have journal tag or are related to a habit)
  useEffect(() => {
    const entries = notes.filter(note => {
      // Check if the note has a habitId relationship or journal tag
      return (
        (note.relationships?.habitId || note.relationships?.taskType === 'journal') ||
        (note.tags && note.tags.includes('journal'))
      );
    });
    
    setJournalEntries(entries);
  }, [notes]);
  
  // Create a journal entry from a habit or task
  const createJournalEntry = useCallback((payload: {
    habitId?: string;
    habitName?: string;
    taskId?: string;
    templateId?: string;
    content?: string;
    date?: string;
  }) => {
    const { habitId, habitName, taskId, templateId, content, date } = payload;
    
    // Create a unique ID for the note based on the habit/task
    const id = `journal-${habitId || taskId}-${date || new Date().toISOString()}`;
    
    // Check if we already have a journal entry for this habit/task/date
    const existingEntry = notes.find(note => 
      (note.relationships?.habitId === habitId || note.relationships?.taskId === taskId) &&
      (note.relationships?.date === date)
    );
    
    if (existingEntry) {
      // Update existing entry
      updateNote(existingEntry.id, { 
        content: content || existingEntry.content,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Journal entry updated');
      return existingEntry.id;
    } else {
      // Create new entry
      const newNote: Omit<Note, 'id'> = {
        title: habitName ? `Journal: ${habitName}` : 'Journal Entry',
        content: content || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['journal'],
        relationships: {
          habitId,
          taskId,
          templateId,
          date: date || new Date().toISOString(),
          type: 'journal'
        }
      };
      
      addNote(newNote);
      toast.success('Journal entry created');
      return id;
    }
  }, [notes, addNote, updateNote]);
  
  // Handle a task completion for a journal habit task
  const handleJournalTaskCompletion = useCallback((task: Task) => {
    if (task.taskType !== 'journal') return;
    
    const habitId = task.relationships?.habitId;
    const templateId = task.relationships?.templateId;
    const date = task.relationships?.date;
    
    // If the task has a journal entry, create/update the note
    if (task.journalEntry) {
      createJournalEntry({
        habitId,
        taskId: task.id,
        templateId,
        content: task.journalEntry,
        date
      });
    }
  }, [createJournalEntry]);
  
  // Set up event listeners
  useEffect(() => {
    // Handle journal:create events
    const createUnsubscribe = eventManager.on('journal:create', createJournalEntry);
    
    // Handle note:create-from-habit events (legacy)
    const legacyCreateUnsubscribe = eventManager.on('note:create-from-habit', (payload: any) => {
      createJournalEntry({
        habitId: payload.habitId,
        habitName: payload.habitName,
        content: payload.content,
        templateId: payload.templateId,
        date: new Date().toISOString()
      });
    });
    
    // Handle journal:open events
    const openUnsubscribe = eventManager.on('journal:open', (payload: any) => {
      // Just log for now, actual implementation would open a journal modal
      console.log('Journal open event received:', payload);
    });
    
    return () => {
      createUnsubscribe();
      legacyCreateUnsubscribe();
      openUnsubscribe();
    };
  }, [createJournalEntry]);
  
  return {
    journalEntries,
    createJournalEntry,
    handleJournalTaskCompletion
  };
};
