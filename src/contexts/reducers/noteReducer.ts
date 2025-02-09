
import type { StateContext } from '@/types/state';
import type { Note } from '@/types/notes';

type NoteAction = 
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { noteId: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null };

export const noteReducer = (state: StateContext['notes'], action: NoteAction): StateContext['notes'] => {
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map(note =>
          note.id === action.payload.noteId
            ? { ...note, ...action.payload.updates }
            : note
        ),
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        items: state.items.filter(note => note.id !== action.payload),
        selected: state.selected === action.payload ? null : state.selected,
      };

    case 'SELECT_NOTE':
      return {
        ...state,
        selected: action.payload,
      };

    default:
      return state;
  }
};
