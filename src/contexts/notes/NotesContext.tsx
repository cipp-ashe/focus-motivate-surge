import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Note, NoteTag } from '@/types/notes';
import { notesReducer } from './notesReducer';
import { STORAGE_KEY } from '@/utils/noteUtils';

// Add diagnostic log
// Remove debug logs for production

// Define initial state
interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
  filter: string | null;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  tags: NoteTag[];
  view: 'grid' | 'list';
  showArchived: boolean;
}

const initialState: NotesState = {
  notes: [],
  selectedNoteId: null,
  isLoading: true,
  error: null,
  filter: null,
  sortBy: 'updatedAt',
  sortDirection: 'desc',
  searchTerm: '',
  tags: [],
  view: 'grid',
  showArchived: false,
};

// Define context
type NotesContextType = {
  state: NotesState;
  // Existing methods
  addNote: (note: Omit<Note, 'id'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  clearSelectedNote: () => void;
  addTagToNote: (noteId: string, tag: NoteTag) => void;
  removeTagFromNote: (noteId: string, tagName: string) => void;
  setFilter: (filter: string | null) => void;
  setSorting: (sortBy: 'createdAt' | 'updatedAt' | 'title', direction: 'asc' | 'desc') => void;
  toggleFavorite: (id: string) => void;
  // Additional methods used by components
  setSearchTerm: (term: string) => void;
  setView: (view: 'grid' | 'list') => void;
  setShowArchived: (show: boolean) => void;
  toggleArchiveNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  createNote: (note: Omit<Note, 'id'>) => string;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Load notes from localStorage
  useEffect(() => {
    console.log('Loading notes from localStorage');
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedNotes = localStorage.getItem(STORAGE_KEY);
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      dispatch({ type: 'SET_NOTES', payload: parsedNotes });
    } catch (error) {
      console.error('Failed to load notes:', error);
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      toast.error('Failed to load notes');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save notes to localStorage when they change
  useEffect(() => {
    if (!state.isLoading && state.notes) {
      console.log('Saving notes to localStorage:', state.notes.length);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes));
      } catch (error) {
        console.error('Failed to save notes:', error);
        toast.error('Failed to save notes to local storage');
      }
    }
  }, [state.notes, state.isLoading]);

  // Add a new note
  const addNote = useCallback((noteData: Omit<Note, 'id'>): string => {
    const id = uuidv4();
    const newNote: Note = { ...noteData, id };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    toast.success('Note created');
    return id;
  }, []);

  // Update an existing note
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    dispatch({
      type: 'UPDATE_NOTE',
      payload: {
        id,
        updates: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }, []);

  // Delete a note
  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    toast.success('Note deleted');
  }, []);

  // Select a note
  const selectNote = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
  }, []);

  // Clear selected note
  const clearSelectedNote = useCallback(() => {
    dispatch({ type: 'SELECT_NOTE', payload: null });
  }, []);

  // Add a tag to a note
  const addTagToNote = useCallback(
    (noteId: string, tag: NoteTag) => {
      const note = state.notes.find((n) => n.id === noteId);
      if (!note) return;

      const existingTag = note.tags.find((t) => t.name === tag.name);
      if (existingTag) {
        // Update existing tag's color
        updateNote(noteId, {
          tags: note.tags.map((t) => (t.name === tag.name ? tag : t)),
        });
      } else {
        // Add new tag
        updateNote(noteId, {
          tags: [...note.tags, tag],
        });
      }
    },
    [state.notes, updateNote]
  );

  // Remove a tag from a note
  const removeTagFromNote = useCallback(
    (noteId: string, tagName: string) => {
      const note = state.notes.find((n) => n.id === noteId);
      if (!note) return;

      updateNote(noteId, {
        tags: note.tags.filter((t) => t.name !== tagName),
      });
    },
    [state.notes, updateNote]
  );

  // Set the filter
  const setFilter = useCallback((filter: string | null) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  // Set the sorting
  const setSorting = useCallback(
    (sortBy: 'createdAt' | 'updatedAt' | 'title', direction: 'asc' | 'desc') => {
      dispatch({
        type: 'SET_SORTING',
        payload: { sortBy, direction },
      });
    },
    []
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (id: string) => {
      const note = state.notes.find((n) => n.id === id);
      if (!note) return;

      updateNote(id, { favorite: !note.favorite });
    },
    [state.notes, updateNote]
  );

  // Additional methods used by components
  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const setView = useCallback((view: 'grid' | 'list') => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const setShowArchived = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_ARCHIVED', payload: show });
  }, []);

  const toggleArchiveNote = useCallback(
    (id: string) => {
      const note = state.notes.find((n) => n.id === id);
      if (!note) return;

      updateNote(id, { archived: !note.archived });
    },
    [state.notes, updateNote]
  );

  const togglePinNote = useCallback(
    (id: string) => {
      const note = state.notes.find((n) => n.id === id);
      if (!note) return;

      updateNote(id, { pinned: !note.pinned });
    },
    [state.notes, updateNote]
  );

  // Alias for addNote for backward compatibility
  const createNote = addNote;

  // Provide the context value
  const contextValue: NotesContextType = {
    state,
    addNote,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    clearSelectedNote,
    addTagToNote,
    removeTagFromNote,
    setFilter,
    setSorting,
    toggleFavorite,
    setSearchTerm,
    setView,
    setShowArchived,
    toggleArchiveNote,
    togglePinNote,
  };

  return <NotesContext.Provider value={contextValue}>{children}</NotesContext.Provider>;
};

// Hook to use notes context
export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  // Remove debug logs for production
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// Export the same hook with a different name for backward compatibility with existing imports
export const useNotesContext = (): NotesContextType => {
  return useNotes();
};
