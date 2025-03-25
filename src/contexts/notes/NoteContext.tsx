import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Note } from '@/types/notes';
import { Tag } from './initialState';
import { EntityType } from '@/types/core';
import { noteReducer } from './noteReducer';
import { useEvent } from '@/hooks/useEvent';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Add diagnostic log
console.log('[DEBUG] NoteContext.tsx is being imported (singular, PascalCase)');

// Import the NoteState from initialState
import { NoteState } from './initialState';

// Define the actions interface
export interface NoteActions {
  addNote: (note: Omit<Note, 'id'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  addVoiceNote: (audioUrl: string, duration: number, transcript?: string, title?: string) => string;
}

// Initial state
const initialState: NoteState = {
  notes: [],
  selectedNoteId: null,
  isLoading: false,
  error: null,
};

// Helper function to create a voice note
const createVoiceNote = (
  title: string,
  audioUrl: string,
  duration: number,
  transcript: string = '',
  tags: Tag[] = []
): Omit<Note, 'id'> => {
  // Convert Tag[] to NoteTag[] by adding an id property
  const convertedTags = tags.map((tag) => ({
    id: uuidv4(), // Generate a unique ID for each tag
    name: tag.name,
    color: tag.color,
  }));

  // Create relationships object in the format expected by NoteRelationships
  const relationships = {
    audioUrl,
    duration: duration.toString(),
  };

  // Return properly typed note data
  return {
    title,
    content: transcript,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: convertedTags,
    type: 'standard' as any, // Type assertion still needed for NoteType
    relationships: relationships,
  };
};

// Create the contexts
const NoteStateContext = createContext<NoteState | undefined>(undefined);
const NoteActionsContext = createContext<NoteActions | undefined>(undefined);

// Define action types - must match those in noteReducer.ts
type NoteAction =
  | { type: 'LOADING' }
  | { type: 'ERROR'; payload: Error }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null };

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  // Load notes on initial render
  useEffect(() => {
    const loadNotes = () => {
      try {
        dispatch({ type: 'LOADING' });
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes);
          dispatch({ type: 'SET_NOTES', payload: parsedNotes });
        } else {
          dispatch({ type: 'SET_NOTES', payload: [] });
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        dispatch({ type: 'ERROR', payload: error as Error });
      }
    };

    loadNotes();
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem('notes', JSON.stringify(state.notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  }, [state.notes, state.isLoading]);

  // Action handlers
  const addNote = useCallback((noteData: Omit<Note, 'id'>): string => {
    const id = uuidv4();

    // Properly convert NoteTag[] to Tag[] by ensuring all tags have a color property
    const convertedTags = noteData.tags?.map((tag) => ({
      name: tag.name,
      color: tag.color || 'default', // Provide a default color if missing
    }));

    // Convert relationships from NoteRelationships to the expected array format
    const convertedRelationships = noteData.relationships
      ? [
          {
            entityId: noteData.relationships.taskId || noteData.relationships.habitId || '',
            entityType: 'note' as EntityType,
          },
        ]
      : undefined;

    // Create a properly typed note with converted properties
    const note = {
      id,
      title: noteData.title,
      content: noteData.content,
      createdAt: noteData.createdAt,
      updatedAt: noteData.updatedAt,
      tags: convertedTags,
      relationships: convertedRelationships,
    };

    dispatch({ type: 'ADD_NOTE', payload: note });
    eventManager.emit('note:add', { note });

    return id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    // Create a properly typed update object
    const convertedUpdates: any = { ...updates };

    // Handle tags conversion if present
    if (updates.tags) {
      // Convert NoteTag[] to Tag[] by ensuring all tags have required properties
      convertedUpdates.tags = updates.tags.map((tag) => ({
        name: tag.name,
        color: tag.color || 'default', // Provide a default color if missing
      }));
    }

    // Handle relationships conversion if present
    if (updates.relationships) {
      // Convert NoteRelationships to the expected array format
      convertedUpdates.relationships = [
        {
          entityId: updates.relationships.taskId || updates.relationships.habitId || '',
          entityType: 'note' as EntityType,
        },
      ];
    }

    // Use type assertion for the final dispatch since we've manually handled the conversions
    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates: convertedUpdates } });

    // For the event, use the original updates to maintain compatibility with event listeners
    eventManager.emit('note:update', { id, updates });
  }, []);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    eventManager.emit('note:delete', { id });
  }, []);

  const selectNote = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
    eventManager.emit('note:select', { id });
  }, []);

  // New method to add a voice note
  const addVoiceNote = useCallback(
    (
      audioUrl: string,
      duration: number,
      transcript: string = '',
      title: string = `Voice Note ${new Date().toLocaleString()}`
    ): string => {
      // Create voice note with proper typing
      const voiceNoteData = createVoiceNote(title, audioUrl, duration, transcript, [
        { name: 'voice-note', color: 'red' },
      ]);

      const id = addNote(voiceNoteData);

      toast.success('Voice note saved');
      eventManager.emit('voice-note:add', { id, audioUrl, duration, transcript });

      return id;
    },
    [addNote]
  );

  // Handle events
  useEvent('note:add', ({ note }) => {
    if (!note.id) {
      addNote(note);
    }
  });

  useEvent('note:delete', ({ id }) => {
    deleteNote(id);
  });

  useEvent('note:update', ({ id, updates }) => {
    updateNote(id, updates);
  });

  useEvent('note:select', ({ id }) => {
    selectNote(id);
  });

  // New event handler for voice notes
  useEvent('voice-note:create', ({ audioUrl, duration, transcript, title }) => {
    addVoiceNote(audioUrl, duration, transcript, title);
  });

  const actions: NoteActions = {
    addNote,
    updateNote,
    deleteNote,
    selectNote,
    addVoiceNote,
  };

  return (
    <NoteStateContext.Provider value={state}>
      <NoteActionsContext.Provider value={actions}>{children}</NoteActionsContext.Provider>
    </NoteStateContext.Provider>
  );
};

// Custom hooks for accessing the contexts
export const useNoteState = () => {
  const context = useContext(NoteStateContext);
  if (context === undefined) {
    throw new Error('useNoteState must be used within a NoteProvider');
  }
  return context;
};

export const useNoteActions = () => {
  const context = useContext(NoteActionsContext);
  if (context === undefined) {
    throw new Error('useNoteActions must be used within a NoteProvider');
  }
  return context;
};

// Combine state and actions for convenience
export const useNotes = () => {
  console.log('[DEBUG] useNotes hook from NoteContext.tsx is being called (singular)');
  return {
    ...useNoteState(),
    ...useNoteActions(),
  };
};
