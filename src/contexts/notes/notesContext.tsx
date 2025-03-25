
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Note } from '@/types/notes';
import { STORAGE_KEY } from '@/utils/noteUtils';
import { useNotesEvents } from '@/hooks/useNotesEvents';

// Simple reducer for handling notes state
const notesReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SELECT_NOTE':
      return { ...state, selectedNoteId: action.payload };
    default:
      return state;
  }
};

// Initial state for the context
const initialState = {
  notes: [],
  selectedNoteId: null,
  isLoading: true,
  error: null,
};

// Create the context
const NotesContext = createContext<any>(undefined);

// Provider component
export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const notesEvents = useNotesEvents();
  
  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      console.log('Loading notes from localStorage');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];
      
      dispatch({ type: 'SET_NOTES', payload: parsedNotes });
    } catch (error) {
      console.error('Failed to load notes:', error);
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  }, []);

  // Set up event listeners for note events
  useEffect(() => {
    const handleNoteCreate = (note: Note) => {
      const updatedNotes = [note, ...state.notes];
      dispatch({ type: 'SET_NOTES', payload: updatedNotes });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    };
    
    const handleNoteSelect = (noteId: string | null) => {
      dispatch({ type: 'SELECT_NOTE', payload: noteId });
    };
    
    // Subscribe to events
    const unsubCreate = notesEvents.onNoteCreate(handleNoteCreate);
    const unsubSelect = notesEvents.onNoteSelect(handleNoteSelect);
    
    return () => {
      unsubCreate();
      unsubSelect();
    };
  }, [state.notes, notesEvents]);

  // Provide the context value
  const value = {
    state,
    dispatch,
    selectNote: (id: string | null) => notesEvents.selectNote(id),
    createNote: (note: Note) => notesEvents.createNote(note),
    updateNote: (id: string, updates: Partial<Note>) => notesEvents.updateNote(id, updates),
    deleteNote: (id: string) => notesEvents.deleteNote(id),
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use the notes context
export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
};
