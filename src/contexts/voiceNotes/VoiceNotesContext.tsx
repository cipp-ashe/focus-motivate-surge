import React, { createContext, useContext, useReducer, useCallback } from 'react';

interface VoiceNote {
  id: string;
  url: string;
  createdAt: string;
  transcription?: string;
  blob: Blob;
}

interface VoiceNotesState {
  voiceNotes: VoiceNote[];
  isRecording: boolean;
  transcribing: { [key: string]: boolean };
}

type VoiceNotesAction =
  | { type: 'CREATE_VOICE_NOTE'; payload: VoiceNote }
  | { type: 'UPDATE_VOICE_NOTE'; payload: { id: string; updates: Partial<VoiceNote> } }
  | { type: 'DELETE_VOICE_NOTE'; payload: string }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_TRANSCRIBING'; payload: { id: string; isTranscribing: boolean } };

const initialState: VoiceNotesState = {
  voiceNotes: [],
  isRecording: false,
  transcribing: {},
};

const VoiceNotesContext = createContext<{
  state: VoiceNotesState;
  dispatch: React.Dispatch<VoiceNotesAction>;
  createVoiceNote: (audioBlob: Blob) => Promise<string | null>;
  deleteVoiceNote: (id: string) => void;
  toggleRecording: () => void;
  transcribe: (voiceNoteId: string) => Promise<string | null>;
}>({
  state: initialState,
  dispatch: () => null,
  createVoiceNote: async () => null,
  deleteVoiceNote: () => {},
  toggleRecording: () => {},
  transcribe: async () => null,
});

function voiceNotesReducer(state: VoiceNotesState, action: VoiceNotesAction): VoiceNotesState {
  switch (action.type) {
    case 'CREATE_VOICE_NOTE':
      return { ...state, voiceNotes: [...state.voiceNotes, action.payload] };
    case 'UPDATE_VOICE_NOTE':
      return {
        ...state,
        voiceNotes: state.voiceNotes.map(voiceNote =>
          voiceNote.id === action.payload.id ? { ...voiceNote, ...action.payload.updates } : voiceNote
        ),
      };
    case 'DELETE_VOICE_NOTE':
      return { ...state, voiceNotes: state.voiceNotes.filter(voiceNote => voiceNote.id !== action.payload) };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_TRANSCRIBING':
      return {
        ...state,
        transcribing: { ...state.transcribing, [action.payload.id]: action.payload.isTranscribing },
      };
    default:
      return state;
  }
}

export const VoiceNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(voiceNotesReducer, initialState);
  
  // Fixed function to properly handle async operations and avoid void truthiness checks
  const createVoiceNote = useCallback(async (audioBlob: Blob) => {
    try {
      // Generate a unique ID for the voice note
      const id = crypto.randomUUID();
      
      // Create an object URL for the audio blob
      const url = URL.createObjectURL(audioBlob);
      
      // Save the voice note to state
      const newVoiceNote = {
        id,
        url,
        createdAt: new Date().toISOString(),
        blob: audioBlob,
      };
      
      dispatch({ type: 'CREATE_VOICE_NOTE', payload: newVoiceNote });
      
      // Return the created voice note ID
      return id;
    } catch (error) {
      console.error('Error creating voice note:', error);
      return null;
    }
  }, [dispatch]);

  const deleteVoiceNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_VOICE_NOTE', payload: id });
  }, [dispatch]);

  const toggleRecording = useCallback(() => {
    dispatch({ type: 'SET_RECORDING', payload: !state.isRecording });
  }, [state.isRecording, dispatch]);

  const transcribe = useCallback(async (voiceNoteId: string): Promise<string | null> => {
    try {
      // Find the voice note by ID
      const voiceNote = state.voiceNotes.find(vn => vn.id === voiceNoteId);
      
      if (!voiceNote) {
        console.error(`Voice note with ID ${voiceNoteId} not found`);
        return null;
      }
      
      // Get the audio blob from the voice note
      const audioBlob = voiceNote.blob;
      
      if (!audioBlob) {
        console.error(`No audio blob found for voice note ${voiceNoteId}`);
        return null;
      }
      
      // Create a FormData object to send the audio file to the server
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      
      // Set loading state for this voice note
      dispatch({ type: 'SET_TRANSCRIBING', payload: { id: voiceNoteId, isTranscribing: true } });
      
      try {
        // Make the API call to transcribe the audio
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Update the voice note with the transcription
        dispatch({
          type: 'UPDATE_VOICE_NOTE',
          payload: { id: voiceNoteId, updates: { transcription: data.text } },
        });
        
        return data.text;
      } finally {
        // Always reset loading state, even if there was an error
        dispatch({ type: 'SET_TRANSCRIBING', payload: { id: voiceNoteId, isTranscribing: false } });
      }
    } catch (error) {
      console.error('Error transcribing voice note:', error);
      toast.error('Failed to transcribe voice note');
      return null;
    }
  }, [state.voiceNotes, dispatch]);

  return (
    <VoiceNotesContext.Provider value={{ state, dispatch, createVoiceNote, deleteVoiceNote, toggleRecording, transcribe }}>
      {children}
    </VoiceNotesContext.Provider>
  );
};

export const useVoiceNotes = () => {
  return useContext(VoiceNotesContext);
};
