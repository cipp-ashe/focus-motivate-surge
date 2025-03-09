
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Note, Tag } from '@/types/notes';
import { eventBus } from '@/lib/eventBus';

// Add a title field to the Note interface
interface NoteState {
  items: Note[];
  selected: string | null;
}

interface NoteInput extends Omit<Note, 'id' | 'createdAt'> {
  title?: string; // Optional title for better UX
}

interface NoteContextActions {
  addNote: (note: NoteInput) => void;
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
          selected: action.payload.id,
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
      
      eventBus.on('note:create-from-habit', (habitData) => {
        console.log('Creating note from habit:', habitData);
        const newNote: Note = {
          id: crypto.randomUUID(),
          content: `## ${habitData.habitName}\n\n${habitData.description}\n\n`,
          createdAt: new Date().toISOString(),
          tags: [{ name: 'journal', color: 'default' }, { name: habitData.habitName.toLowerCase(), color: 'default' }]
        };
        
        // Save to state via dispatch
        dispatch({ type: 'ADD_NOTE', payload: newNote });
        
        // Also save to localStorage
        const existingNotes = JSON.parse(localStorage.getItem('notes') || '[]');
        localStorage.setItem('notes', JSON.stringify([newNote, ...existingNotes]));
      }),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const actions: NoteContextActions = {
    addNote: (noteInput) => {
      // Handle the title field - add it to content if provided
      let content = noteInput.content;
      
      if (noteInput.title) {
        // If content doesn't start with a heading, add the title as a heading
        if (!content.trim().startsWith('#')) {
          content = `# ${noteInput.title}\n\n${content}`;
        }
      }
      
      const newNote: Note = {
        content,
        tags: noteInput.tags || [],
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      // Save to state
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      
      // Also save to localStorage
      const existingNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      localStorage.setItem('notes', JSON.stringify([newNote, ...existingNotes]));
      
      toast.success('Note added ✨');
    },
    
    updateNote: (noteId, updates) => {
      dispatch({ type: 'UPDATE_NOTE', payload: { noteId, updates } });
      
      // Update in localStorage too
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const updatedNotes = notes.map((note: Note) => 
        note.id === noteId ? { ...note, ...updates } : note
      );
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    },
    
    deleteNote: (noteId) => {
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
      
      // Delete from localStorage too
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const filteredNotes = notes.filter((note: Note) => note.id !== noteId);
      localStorage.setItem('notes', JSON.stringify(filteredNotes));
      
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
