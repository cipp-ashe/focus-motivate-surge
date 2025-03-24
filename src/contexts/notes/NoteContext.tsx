
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Note, Tag, createNote, createVoiceNote } from '@/types/notes';
import { noteReducer } from './noteReducer';
import { useEvent } from '@/hooks/useEvent';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Define the state interface
export interface NoteState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoaded: boolean;
}

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
  isLoaded: false
};

// Create the contexts
const NoteStateContext = createContext<NoteState | undefined>(undefined);
const NoteActionsContext = createContext<NoteActions | undefined>(undefined);

// Define action types
type NoteAction =
  | { type: 'LOAD_NOTES'; payload: Note[] }
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
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes);
          dispatch({ type: 'LOAD_NOTES', payload: parsedNotes });
        } else {
          dispatch({ type: 'LOAD_NOTES', payload: [] });
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        dispatch({ type: 'LOAD_NOTES', payload: [] });
      }
    };

    loadNotes();
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    if (state.isLoaded) {
      try {
        localStorage.setItem('notes', JSON.stringify(state.notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  }, [state.notes, state.isLoaded]);

  // Action handlers
  const addNote = useCallback((noteData: Omit<Note, 'id'>): string => {
    const id = uuidv4();
    const note: Note = { id, ...noteData };
    
    dispatch({ type: 'ADD_NOTE', payload: note });
    eventManager.emit('note:add', { note });
    
    return id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } });
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
  const addVoiceNote = useCallback((
    audioUrl: string, 
    duration: number, 
    transcript: string = '',
    title: string = `Voice Note ${new Date().toLocaleString()}`
  ): string => {
    const voiceNoteData = createVoiceNote(
      title,
      audioUrl,
      duration,
      transcript,
      [{ name: 'voice-note', color: 'red' }]
    );
    
    const id = addNote(voiceNoteData);
    
    toast.success('Voice note saved');
    eventManager.emit('voice-note:add', { id, audioUrl, duration, transcript });
    
    return id;
  }, [addNote]);

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
    addVoiceNote
  };

  return (
    <NoteStateContext.Provider value={state}>
      <NoteActionsContext.Provider value={actions}>
        {children}
      </NoteActionsContext.Provider>
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
  return {
    ...useNoteState(),
    ...useNoteActions()
  };
};
