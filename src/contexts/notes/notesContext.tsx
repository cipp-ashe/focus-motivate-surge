
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Note, NoteTag, NoteSortOption, NoteSortDirection } from '@/types/notes';
import { notesReducer } from './notesReducer';
import { v4 as uuidv4 } from 'uuid';
import { eventManager } from '@/lib/events/EventManager';
import { useNotesEvents } from '@/hooks/useNotesEvents';

// Define NotesContext state interface
interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  error: Error | null;
  filter: string | null;
  sortBy: NoteSortOption;
  sortDirection: NoteSortDirection;
  searchTerm: string;
  tags: NoteTag[];
  view: 'grid' | 'list';
  showArchived: boolean;
}

// Define context interface
interface NotesContextValue {
  state: NotesState;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  setFilter: (filter: string | null) => void;
  setSorting: (sortBy: NoteSortOption, direction: NoteSortDirection) => void;
  setSearchTerm: (term: string) => void;
  addTag: (tag: Omit<NoteTag, 'id'>) => NoteTag;
  removeTag: (tagId: string) => void;
  addTagToNote: (noteId: string, tag: NoteTag) => void;
  removeTagFromNote: (noteId: string, tagId: string) => void;
  setView: (view: 'grid' | 'list') => void;
  toggleArchiveNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  setShowArchived: (show: boolean) => void;
}

// Initial state
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
  showArchived: false
};

// Create context
const NotesContext = createContext<NotesContextValue | undefined>(undefined);

// Provider component
export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const notesEvents = useNotesEvents();
  
  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load notes
      const savedNotes = localStorage.getItem('notes');
      const notes = savedNotes ? JSON.parse(savedNotes) : [];
      
      // Load tags
      const savedTags = localStorage.getItem('note-tags');
      const tags = savedTags ? JSON.parse(savedTags) : [];
      
      dispatch({ type: 'SET_NOTES', payload: notes });
      dispatch({ type: 'SET_TAGS', payload: tags });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
    }
  }, []);
  
  // Setup event listeners for note events
  useEffect(() => {
    const handleNoteCreate = (note: Note) => {
      dispatch({ type: 'ADD_NOTE', payload: note });
    };
    
    const handleNoteUpdate = (data: { id: string, updates: Partial<Note> }) => {
      dispatch({ type: 'UPDATE_NOTE', payload: data });
    };
    
    const handleNoteDelete = (data: { id: string }) => {
      dispatch({ type: 'DELETE_NOTE', payload: data.id });
    };
    
    const handleNoteSelect = (noteId: string | null) => {
      dispatch({ type: 'SELECT_NOTE', payload: noteId });
    };
    
    const handleTagsUpdate = (data: { noteId: string, tags: NoteTag[] }) => {
      dispatch({ type: 'UPDATE_NOTE_TAGS', payload: data });
    };
    
    const handleNoteArchive = (data: { id: string }) => {
      dispatch({ type: 'ARCHIVE_NOTE', payload: data.id });
    };
    
    const handleNoteUnarchive = (data: { id: string }) => {
      dispatch({ type: 'UNARCHIVE_NOTE', payload: data.id });
    };
    
    const handleNotePin = (data: { id: string }) => {
      dispatch({ type: 'PIN_NOTE', payload: data.id });
    };
    
    const handleNoteUnpin = (data: { id: string }) => {
      dispatch({ type: 'UNPIN_NOTE', payload: data.id });
    };
    
    const unsubNoteCreate = eventManager.on('note:create', handleNoteCreate);
    const unsubNoteUpdate = eventManager.on('note:update', handleNoteUpdate);
    const unsubNoteDelete = eventManager.on('note:delete', handleNoteDelete);
    const unsubNoteSelect = eventManager.on('note:select', handleNoteSelect);
    const unsubTagsUpdate = eventManager.on('note:tags:update', handleTagsUpdate);
    const unsubNoteArchive = eventManager.on('note:archive', handleNoteArchive);
    const unsubNoteUnarchive = eventManager.on('note:unarchive', handleNoteUnarchive);
    const unsubNotePin = eventManager.on('note:pin', handleNotePin);
    const unsubNoteUnpin = eventManager.on('note:unpin', handleNoteUnpin);
    
    return () => {
      unsubNoteCreate();
      unsubNoteUpdate();
      unsubNoteDelete();
      unsubNoteSelect();
      unsubTagsUpdate();
      unsubNoteArchive();
      unsubNoteUnarchive();
      unsubNotePin();
      unsubNoteUnpin();
    };
  }, []);
  
  // Persist notes when they change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('notes', JSON.stringify(state.notes));
    }
  }, [state.notes, state.isLoading]);
  
  // Persist tags when they change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('note-tags', JSON.stringify(state.tags));
    }
  }, [state.tags, state.isLoading]);
  
  // CRUD Operations
  const createNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const id = uuidv4();
    
    const newNote: Note = {
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...noteData
    };
    
    notesEvents.createNote(newNote);
    return id;
  };
  
  const updateNote = (id: string, updates: Partial<Note>) => {
    notesEvents.updateNote(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };
  
  const deleteNote = (id: string) => {
    notesEvents.deleteNote(id);
  };
  
  const selectNote = (id: string | null) => {
    notesEvents.selectNote(id);
  };
  
  // Filter and Sort
  const setFilter = (filter: string | null) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };
  
  const setSorting = (sortBy: NoteSortOption, direction: NoteSortDirection) => {
    dispatch({ 
      type: 'SET_SORTING', 
      payload: { sortBy, direction } 
    });
  };
  
  const setSearchTerm = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };
  
  // Tag Management
  const addTag = (tagData: Omit<NoteTag, 'id'>) => {
    const id = uuidv4();
    const newTag: NoteTag = { id, ...tagData };
    
    dispatch({ type: 'ADD_TAG', payload: newTag });
    return newTag;
  };
  
  const removeTag = (tagId: string) => {
    dispatch({ type: 'REMOVE_TAG', payload: tagId });
  };
  
  const addTagToNote = (noteId: string, tag: NoteTag) => {
    const note = state.notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Make sure tag exists in global tags
    let existingTag = state.tags.find(t => t.id === tag.id);
    if (!existingTag) {
      existingTag = addTag(tag);
    }
    
    // Add tag to note if it doesn't already have it
    if (!note.tags.some(t => t.id === existingTag!.id)) {
      notesEvents.updateNoteTags(noteId, [...note.tags, existingTag]);
    }
  };
  
  const removeTagFromNote = (noteId: string, tagId: string) => {
    const note = state.notes.find(n => n.id === noteId);
    if (!note) return;
    
    notesEvents.updateNoteTags(
      noteId, 
      note.tags.filter(t => t.id !== tagId)
    );
  };
  
  // View Management
  const setView = (view: 'grid' | 'list') => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };
  
  // Archive Management
  const toggleArchiveNote = (id: string) => {
    const note = state.notes.find(n => n.id === id);
    if (!note) return;
    
    if (note.archived) {
      notesEvents.unarchiveNote(id);
    } else {
      notesEvents.archiveNote(id);
    }
  };
  
  // Pin Management
  const togglePinNote = (id: string) => {
    const note = state.notes.find(n => n.id === id);
    if (!note) return;
    
    if (note.pinned) {
      notesEvents.unpinNote(id);
    } else {
      notesEvents.pinNote(id);
    }
  };
  
  // Show Archived
  const setShowArchived = (show: boolean) => {
    dispatch({ type: 'SET_SHOW_ARCHIVED', payload: show });
  };
  
  const contextValue: NotesContextValue = {
    state,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setFilter,
    setSorting,
    setSearchTerm,
    addTag,
    removeTag,
    addTagToNote,
    removeTagFromNote,
    setView,
    toggleArchiveNote,
    togglePinNote,
    setShowArchived
  };
  
  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use the Notes context
export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
};
