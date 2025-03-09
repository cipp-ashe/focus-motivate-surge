
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Note, Tag } from '@/types/notes';
import { eventBus } from '@/lib/eventBus';
import { relationshipManager } from '@/lib/relationshipManager';

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
        
        // Create tags for the journal entry - just journal and the journal type
        const tags: Tag[] = [
          { name: 'journal', color: 'default' },
          { name: getJournalType(habitData.habitName, habitData.description), color: 'default' }
        ];
        
        const newNote: Note = {
          id: crypto.randomUUID(),
          content: habitData.content || `## ${habitData.habitName}\n\n${habitData.description}\n\n`,
          createdAt: new Date().toISOString(),
          tags
        };
        
        // Save to state via dispatch
        dispatch({ type: 'ADD_NOTE', payload: newNote });
        
        // Also save to localStorage
        const existingNotes = JSON.parse(localStorage.getItem('notes') || '[]');
        localStorage.setItem('notes', JSON.stringify([newNote, ...existingNotes]));

        // Create a relationship between the habit and the note for bidirectional tracking
        if (habitData.habitId) {
          relationshipManager.createRelationship(
            habitData.habitId, 
            'habit', 
            newNote.id, 
            'note', 
            'habit-journal'
          );
          console.log(`Created relationship between habit ${habitData.habitId} and note ${newNote.id}`);
        }
      }),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  // Helper function to determine journal type
  const getJournalType = (habitName: string, description: string = ""): string => {
    const lowerName = habitName.toLowerCase();
    const lowerDesc = description.toLowerCase();
    
    if (lowerName.includes("gratitude") || lowerDesc.includes("gratitude")) {
      return "gratitude";
    } else if (lowerName.includes("reflect") || lowerDesc.includes("reflect")) {
      return "reflection";
    } else if (lowerName.includes("mindful") || lowerDesc.includes("mindful") || 
               lowerName.includes("meditat") || lowerDesc.includes("meditat")) {
      return "mindfulness";
    }
    
    // Default to gratitude if no match
    return "gratitude";
  };

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
      
      // Before deleting, check if this note is related to any habits
      const relatedHabits = relationshipManager.getRelatedEntities(noteId, 'note', 'habit');
      
      // Delete from localStorage too
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const filteredNotes = notes.filter((note: Note) => note.id !== noteId);
      localStorage.setItem('notes', JSON.stringify(filteredNotes));
      
      // Delete any relationships
      relatedHabits.forEach(entity => {
        relationshipManager.deleteRelationship(entity.id, noteId);
        
        // Emit an event to update the habit completion status
        eventBus.emit('habit:journal-deleted', {
          habitId: entity.id,
        });
        
        console.log(`Relationship deleted between habit ${entity.id} and note ${noteId}`);
      });
      
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
