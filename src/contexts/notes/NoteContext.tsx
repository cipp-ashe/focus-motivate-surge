import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { noteReducer } from './noteReducer';
import { initialState } from './initialState';
import { eventManager } from '@/lib/events/EventManager';
import { EventType } from '@/types/events';
import { Note } from '@/types/notes';

interface NoteContextProps {
  notes: Note[];
  selectedNoteId: string | null;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string) => void;
  clearSelectedNote: () => void;
}

const NoteContext = createContext<NoteContextProps>({
  notes: [],
  selectedNoteId: null,
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  selectNote: () => {},
  clearSelectedNote: () => {},
});

interface NoteProviderProps {
  children: React.ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      dispatch({ type: 'LOAD_NOTES', payload: JSON.parse(storedNotes) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes));
  }, [state.notes]);

  const addNote = (note: Note) => {
    dispatch({ type: 'ADD_NOTE', payload: note });
  };

  const updateNote = (note: Note) => {
    dispatch({ type: 'UPDATE_NOTE', payload: note });
  };

  const deleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const selectNote = (id: string) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
  };

  const clearSelectedNote = () => {
    dispatch({ type: 'CLEAR_SELECTED_NOTE' });
  };

  useEffect(() => {
    const handleJournalOpen = (payload: any) => {
      console.log('Journal opened for habit:', payload);
      const newNote: Note = {
        id: payload.habitId,
        title: payload.habitName,
        content: payload.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'Habit',
        tags: [payload.templateId || 'habit']
      };
      addNote(newNote);
      selectNote(newNote.id);
    };

    eventManager.on('journal:open' as EventType, handleJournalOpen);

    return () => {
      eventManager.off('journal:open' as EventType, handleJournalOpen);
    };
  }, [addNote, selectNote]);

  const value: NoteContextProps = {
    notes: state.notes,
    selectedNoteId: state.selectedNoteId,
    addNote,
    updateNote,
    deleteNote,
    selectNote,
    clearSelectedNote,
  };

  return (
    <NoteContext.Provider value={value}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};
