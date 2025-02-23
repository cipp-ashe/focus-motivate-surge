
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Note } from '@/types/notes';
import { eventBus } from '@/lib/eventBus';

interface NoteState {
  items: Note[];
  selected: string | null;
}

interface NoteContextActions {
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  selectNote: (noteId: string | null) => void;
}

const NoteContext = createContext<NoteState | undefined>(undefined);
const NoteActionsContext = createContext<NoteContextActions | undefined>(undefined);

const initialState: NoteState = {
  items: [],
  selected: null,
};

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer((state: NoteState, action: any) => {
    switch (action.type) {
      case 'LOAD_NOTES':
        return {
          ...state,
          items: action.payload,
        };
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
  }, initialState);

  // Load initial data
  useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      try {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        dispatch({ type: 'LOAD_NOTES', payload: notes });
        return notes;
      } catch (error) {
        console.error('Error loading notes:', error);
        toast.error('Failed to load notes');
        return [];
      }
    }
  });

  // Event bus subscriptions
  useEffect(() => {
    const unsubscribers = [
      eventBus.on('note:create', (note) => {
        dispatch({ type: 'ADD_NOTE', payload: note });
      }),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const actions: NoteContextActions = {
    addNote: (note) => {
      const newNote: Note = {
        ...note,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      eventBus.emit('note:create', newNote);
      toast.success('Note added ✨');
    },
    
    updateNote: (noteId, updates) => {
      dispatch({ type: 'UPDATE_NOTE', payload: { noteId, updates } });
    },
    
    deleteNote: (noteId) => {
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
      toast.success('Note deleted 🗑️');
    },
    
    selectNote: (noteId) => {
      dispatch({ type: 'SELECT_NOTE', payload: noteId });
    },
  };

  return (
    <NoteContext.Provider value={state}>
      <NoteActionsContext.Provider value={actions}>
        {children}
      </NoteActionsContext.Provider>
    </NoteContext.Provider>
  );
};

export const useNoteState = () => {
  const context = useContext(NoteContext);
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
