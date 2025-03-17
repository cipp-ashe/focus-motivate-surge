
import React, { createContext, useContext, useReducer, useState, useCallback } from 'react';
import { VoiceNote } from '@/types/voiceNotes';
import { v4 as uuidv4 } from 'uuid';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { AllEventTypes } from '@/types/events';

// Define state
export interface VoiceNotesState {
  notes: VoiceNote[];
  isRecording: boolean;
  currentTranscript: string;
}

// Define actions
type VoiceNotesAction = 
  | { type: 'ADD_NOTE'; payload: VoiceNote }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'TOGGLE_NOTE_COMPLETE'; payload: string }
  | { type: 'UPDATE_NOTE_TEXT'; payload: { id: string; text: string } }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_TRANSCRIPT'; payload: string }
  | { type: 'CLEAR_TRANSCRIPT' };

// Create context
const VoiceNotesContext = createContext<{
  state: VoiceNotesState;
  dispatch: React.Dispatch<VoiceNotesAction>;
  createVoiceNote: (audioBlob: Blob) => Promise<string>;
  deleteVoiceNote: (id: string) => void;
  toggleRecording: () => void;
  transcribe: (voiceNoteId: string) => Promise<string>;
  // Add missing methods
  notes: VoiceNote[];
  addNote: (text: string) => void;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  updateNoteText: (id: string, text: string) => void;
  createNoteFromVoiceNote: (voiceNoteId: string) => void;
} | undefined>(undefined);

// Reducer function
const voiceNotesReducer = (state: VoiceNotesState, action: VoiceNotesAction): VoiceNotesState => {
  switch (action.type) {
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes]
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    case 'TOGGLE_NOTE_COMPLETE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload 
            ? { ...note, isComplete: !note.isComplete } 
            : note
        )
      };
    case 'UPDATE_NOTE_TEXT':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id 
            ? { ...note, text: action.payload.text } 
            : note
        )
      };
    case 'SET_RECORDING':
      return {
        ...state,
        isRecording: action.payload
      };
    case 'SET_TRANSCRIPT':
      return {
        ...state,
        currentTranscript: action.payload
      };
    case 'CLEAR_TRANSCRIPT':
      return {
        ...state,
        currentTranscript: ''
      };
    default:
      return state;
  }
};

// Initial state
const initialState: VoiceNotesState = {
  notes: [],
  isRecording: false,
  currentTranscript: ''
};

// Provider component
export const VoiceNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(voiceNotesReducer, initialState);
  
  // Create a new voice note
  const createVoiceNote = useCallback(async (audioBlob: Blob): Promise<string> => {
    try {
      const id = uuidv4();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const newNote: VoiceNote = {
        id,
        text: state.currentTranscript || 'Voice note (no transcript)',
        timestamp: new Date().getTime(), // Fix: use number instead of string
        audioUrl,
        isComplete: false
      };
      
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      dispatch({ type: 'CLEAR_TRANSCRIPT' });
      
      // Custom event, not in AllEventTypes - use any to bypass type check
      eventManager.emit('voice-note:created' as any, { noteId: id });
      
      return id;
    } catch (error) {
      console.error('Error creating voice note:', error);
      return '';
    }
  }, [state.currentTranscript]);
  
  // Delete a voice note
  const deleteVoiceNote = useCallback((id: string) => {
    const noteToDelete = state.notes.find(note => note.id === id);
    if (noteToDelete?.audioUrl) {
      URL.revokeObjectURL(noteToDelete.audioUrl);
    }
    
    dispatch({ type: 'DELETE_NOTE', payload: id });
    // Custom event, not in AllEventTypes - use any to bypass type check
    eventManager.emit('voice-note:deleted' as any, { noteId: id });
  }, [state.notes]);
  
  // Toggle recording state
  const toggleRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING', payload: !state.isRecording });
  }, [state.isRecording]);
  
  // Transcribe a voice note (placeholder for actual implementation)
  const transcribe = useCallback(async (voiceNoteId: string): Promise<string> => {
    // Placeholder for actual transcription implementation
    console.log(`Transcribing voice note ${voiceNoteId}`);
    return 'Transcription not implemented';
  }, []);

  // Add missing methods to match the components' expectations
  const addNote = useCallback((text: string) => {
    const newNote: VoiceNote = {
      id: uuidv4(),
      text,
      timestamp: new Date().getTime(), // Fix: use number instead of string
      isComplete: false
    };
    
    dispatch({ type: 'ADD_NOTE', payload: newNote });
  }, []);
  
  const deleteNote = useCallback((id: string) => {
    deleteVoiceNote(id);
  }, [deleteVoiceNote]);
  
  const toggleNoteComplete = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_NOTE_COMPLETE', payload: id });
  }, []);
  
  const updateNoteText = useCallback((id: string, text: string) => {
    dispatch({ type: 'UPDATE_NOTE_TEXT', payload: { id, text } });
  }, []);
  
  const createNoteFromVoiceNote = useCallback((voiceNoteId: string) => {
    const voiceNote = state.notes.find(note => note.id === voiceNoteId);
    if (voiceNote) {
      // Fix: Use proper payload structure for note:create-from-voice event
      eventManager.emit('note:create-from-voice' as AllEventTypes, { 
        audioUrl: voiceNote.audioUrl || '',
        transcript: voiceNote.text
      });
      
      toast.success("Note created from voice note");
    }
  }, [state.notes]);

  const value = {
    state,
    dispatch,
    createVoiceNote,
    deleteVoiceNote,
    toggleRecording,
    transcribe,
    // Added properties for components
    notes: state.notes,
    addNote,
    deleteNote,
    toggleNoteComplete,
    updateNoteText,
    createNoteFromVoiceNote
  };
  
  return (
    <VoiceNotesContext.Provider value={value}>
      {children}
    </VoiceNotesContext.Provider>
  );
};

// Custom hook to use voice notes context
export const useVoiceNotes = () => {
  const context = useContext(VoiceNotesContext);
  if (context === undefined) {
    throw new Error('useVoiceNotes must be used within a VoiceNotesProvider');
  }
  return context;
};
