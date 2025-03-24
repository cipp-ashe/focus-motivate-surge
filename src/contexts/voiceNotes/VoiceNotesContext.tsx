
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

// Define voice note type
export interface VoiceNote {
  id: string;
  audioUrl: string;
  text?: string;
  duration: number;
  createdAt: string;
  completed?: boolean;
}

// Define the initial state
interface VoiceNotesState {
  notes: VoiceNote[];
}

// Define the context type
export interface VoiceNotesContextType {
  notes: VoiceNote[];
  addNote: (note: Omit<VoiceNote, 'id' | 'createdAt'>) => void;
  updateNoteText: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  createNoteFromVoiceNote: (id: string) => void;
}

// Create context
const VoiceNotesContext = createContext<VoiceNotesContextType>({
  notes: [],
  addNote: () => {},
  updateNoteText: () => {},
  deleteNote: () => {},
  toggleNoteComplete: () => {},
  createNoteFromVoiceNote: () => {},
});

// Action types
type VoiceNotesAction =
  | { type: 'ADD_NOTE'; payload: VoiceNote }
  | { type: 'UPDATE_NOTE_TEXT'; payload: { id: string; text: string } }
  | { type: 'DELETE_NOTE'; payload: { id: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string } }
  | { type: 'SET_NOTES'; payload: VoiceNote[] };

// Reducer
const voiceNotesReducer = (state: VoiceNotesState, action: VoiceNotesAction): VoiceNotesState => {
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    case 'UPDATE_NOTE_TEXT':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? { ...note, text: action.payload.text }
            : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload.id),
      };
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? { ...note, completed: !note.completed }
            : note
        ),
      };
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const VoiceNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(voiceNotesReducer, { notes: [] });

  // Load notes from localStorage on initial render
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('voiceNotes');
      if (savedNotes) {
        dispatch({ type: 'SET_NOTES', payload: JSON.parse(savedNotes) });
      }
    } catch (error) {
      console.error('Error loading voice notes from localStorage:', error);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('voiceNotes', JSON.stringify(state.notes));
    } catch (error) {
      console.error('Error saving voice notes to localStorage:', error);
    }
  }, [state.notes]);

  // Add a new voice note
  const addNote = (note: Omit<VoiceNote, 'id' | 'createdAt'>) => {
    const newNote: VoiceNote = {
      id: `voice-note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...note,
    };
    
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    eventManager.emit('voice-note:add', newNote);
    toast.success('Voice note saved');
  };

  // Update the transcribed text of a voice note
  const updateNoteText = (id: string, text: string) => {
    dispatch({ type: 'UPDATE_NOTE_TEXT', payload: { id, text } });
    eventManager.emit('voice-note:transcript', { id, text });
    toast.success('Voice note transcript updated');
  };

  // Delete a voice note
  const deleteNote = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: { id } });
    eventManager.emit('voice-note:delete', { id });
    toast.success('Voice note deleted');
  };

  // Toggle a voice note's completed status
  const toggleNoteComplete = (id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: { id } });
    toast.success('Voice note status updated');
  };

  // Create a note from a voice note
  const createNoteFromVoiceNote = (id: string) => {
    const voiceNote = state.notes.find(note => note.id === id);
    
    if (!voiceNote || !voiceNote.text) {
      toast.error('Cannot create note: no transcript available');
      return;
    }
    
    // Create a note using the voice note's transcript
    eventManager.emit('note:add', { 
      note: {
        id: `note-from-voice-${Date.now()}`,
        title: `Voice Note (${new Date(voiceNote.createdAt).toLocaleString()})`,
        content: voiceNote.text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['voice-note']
      }
    });
    
    toast.success('Note created from voice transcript');
  };

  return (
    <VoiceNotesContext.Provider value={{ 
      notes: state.notes,
      addNote, 
      updateNoteText, 
      deleteNote,
      toggleNoteComplete,
      createNoteFromVoiceNote
    }}>
      {children}
    </VoiceNotesContext.Provider>
  );
};

// Custom hook to use the voice notes context
export const useVoiceNotes = () => useContext(VoiceNotesContext);
