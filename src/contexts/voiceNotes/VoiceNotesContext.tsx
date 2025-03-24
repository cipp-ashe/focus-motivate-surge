import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { eventManager } from '@/lib/events/EventManager';

// Define the VoiceNote type
export interface VoiceNote {
  id: string;
  name: string;
  url: string;
  duration: number;
  createdAt: string;
  transcript: string | null;
}

// Define the VoiceNotesContext type
interface VoiceNotesContextType {
  voiceNotes: VoiceNote[];
  addVoiceNote: (name: string, url: string, duration: number) => string;
  deleteVoiceNote: (id: string) => void;
  updateTranscript: (voiceNoteId: string, transcript: string) => void;
}

// Create the VoiceNotesContext
const VoiceNotesContext = createContext<VoiceNotesContextType | undefined>(undefined);

// Create a provider component
export const VoiceNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{ voiceNotes: VoiceNote[] }>({ voiceNotes: [] });
  const { voiceNotes } = state;

  useEffect(() => {
    loadVoiceNotes();
  }, []);

  const loadVoiceNotes = () => {
    try {
      const storedVoiceNotes = localStorage.getItem('voice-notes');
      if (storedVoiceNotes) {
        setState(prevState => ({
          ...prevState,
          voiceNotes: JSON.parse(storedVoiceNotes),
        }));
      }
    } catch (error) {
      console.error('Failed to load voice notes from local storage', error);
    }
  };

  const saveVoiceNotes = (voiceNotes: VoiceNote[]) => {
    try {
      localStorage.setItem('voice-notes', JSON.stringify(voiceNotes));
    } catch (error) {
      console.error('Failed to save voice notes to local storage', error);
    }
  };

  const addVoiceNote = (name: string, url: string, duration: number) => {
    const voiceNote = {
      id: uuidv4(),
      name,
      url,
      duration,
      createdAt: new Date().toISOString(),
      transcript: null,
    };

    setState(prev => ({
      ...prev,
      voiceNotes: [...prev.voiceNotes, voiceNote],
    }));
    
    saveVoiceNotes([...voiceNotes, voiceNote]);
    
    eventManager.emit('voice-note:add', {
      id: voiceNote.id, 
      name: voiceNote.name, 
      url: voiceNote.url, 
      duration: voiceNote.duration
    });
    
    return voiceNote.id;
  };

  const deleteVoiceNote = (id: string) => {
    setState(prev => ({
      ...prev,
      voiceNotes: prev.voiceNotes.filter(note => note.id !== id),
    }));
    
    saveVoiceNotes(voiceNotes.filter(note => note.id !== id));
    
    eventManager.emit('voice-note:delete', { id });
  };

  const updateTranscript = (voiceNoteId: string, transcript: string) => {
    setState(prev => ({
      ...prev,
      voiceNotes: prev.voiceNotes.map(note => 
        note.id === voiceNoteId 
          ? { ...note, transcript } 
          : note
      ),
    }));
    
    saveVoiceNotes(
      voiceNotes.map(note => 
        note.id === voiceNoteId 
          ? { ...note, transcript } 
          : note
      )
    );
    
    eventManager.emit('voice-note:transcript', { 
      id: voiceNoteId,
      transcript 
    });
  };

  const value: VoiceNotesContextType = {
    voiceNotes,
    addVoiceNote,
    deleteVoiceNote,
    updateTranscript,
  };

  return (
    <VoiceNotesContext.Provider value={value}>
      {children}
    </VoiceNotesContext.Provider>
  );
};

// Create a custom hook to use the context
export const useVoiceNotes = () => {
  const context = useContext(VoiceNotesContext);
  if (!context) {
    throw new Error('useVoiceNotes must be used within a VoiceNotesProvider');
  }
  return context;
};
