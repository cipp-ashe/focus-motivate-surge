
import { useContext, createContext } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note, Tag, TagColor } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';

// Define the types for actions and state
export interface NoteActions {
  updateCurrentContent: (content: string) => void;
  selectNoteForEdit: (note: Note) => void;
  clearSelectedNote: () => void;
  addNote: () => Note | null;
  updateNote: (noteId: string, content: string) => boolean;
  deleteNote: (noteId: string) => boolean;
  addTagToNote: (noteId: string, tagName: string, color?: TagColor) => boolean;
  removeTagFromNote: (noteId: string, tagName: string) => boolean;
}

export interface NoteState {
  items: Note[];
  selected: Note | null;
  content: string;
}

// Create the context
const NoteActionsContext = createContext<NoteActions | undefined>(undefined);
const NoteStateContext = createContext<NoteState | undefined>(undefined);

// Create wrapper component that provides notes context
export const NoteContextProvider = ({ children }: { children: React.ReactNode }) => {
  const notes = useNotes();
  
  // Implement actions that utilize the event manager where appropriate
  const actions: NoteActions = {
    updateCurrentContent: notes.updateCurrentContent,
    selectNoteForEdit: (note: Note) => {
      notes.selectNoteForEdit(note);
      // Emit event when a note is selected for viewing/editing
      eventManager.emit('note:view', { noteId: note.id });
    },
    clearSelectedNote: notes.clearSelectedNote,
    addNote: () => {
      const newNote = notes.addNote();
      if (newNote) {
        // Event will be emitted by the useNotes hook
        eventManager.emit('note:create', newNote);
      }
      return newNote;
    },
    updateNote: (noteId: string, content: string) => {
      const success = notes.updateNote(noteId, content);
      if (success) {
        const updatedNote = notes.notes.find(note => note.id === noteId);
        if (updatedNote) {
          eventManager.emit('note:update', { 
            id: noteId, 
            updates: updatedNote 
          });
        }
      }
      return success;
    },
    deleteNote: (noteId: string) => {
      const success = notes.deleteNote(noteId);
      if (success) {
        eventManager.emit('note:deleted', { noteId });
      }
      return success;
    },
    addTagToNote: notes.addTagToNote,
    removeTagFromNote: notes.removeTagFromNote
  };
  
  const state: NoteState = {
    items: notes.notes,
    selected: notes.selectedNote,
    content: notes.currentContent
  };
  
  return (
    <NoteActionsContext.Provider value={actions}>
      <NoteStateContext.Provider value={state}>
        {children}
      </NoteStateContext.Provider>
    </NoteActionsContext.Provider>
  );
};

// Custom hooks to use the note context
export const useNoteActions = () => {
  const context = useContext(NoteActionsContext);
  if (context === undefined) {
    throw new Error('useNoteActions must be used within a NoteContextProvider');
  }
  return context;
};

export const useNoteState = () => {
  const context = useContext(NoteStateContext);
  if (context === undefined) {
    throw new Error('useNoteState must be used within a NoteContextProvider');
  }
  return context;
};
