/**
 * Re-export hooks from both context files for backward compatibility
 */
import { useNotes as useNotesFromSingular, useNoteState, useNoteActions } from './NoteContext';
import { useNotes as useNotesFromPlural, useNotesContext } from './NotesContext';

// Export hooks from NoteContext (singular)
export { useNoteState, useNoteActions };

// Export hooks from NotesContext (plural)
export { useNotesContext };

// Default to the plural version
export const useNotes = useNotesFromPlural;
