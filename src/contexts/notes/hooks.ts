
import { useContext, createContext } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note, Tag, TagColor } from '@/types/notes';

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
  
  const actions: NoteActions = {
    updateCurrentContent: notes.updateCurrentContent,
    selectNoteForEdit: notes.selectNoteForEdit,
    clearSelectedNote: notes.clearSelectedNote,
    addNote: notes.addNote,
    updateNote: notes.updateNote,
    deleteNote: notes.deleteNote,
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
