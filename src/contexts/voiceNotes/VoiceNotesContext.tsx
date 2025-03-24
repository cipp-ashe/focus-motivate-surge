
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent';
import { v4 as uuidv4 } from 'uuid';

// Define VoiceNote type
export interface VoiceNote {
  id: string;
  text: string;
  audioUrl?: string;
  timestamp: string;
  isComplete: boolean;
  duration?: number;
}

// Define context value type
interface VoiceNotesContextValue {
  notes: VoiceNote[];
  addNote: (text: string, audioUrl?: string, duration?: number) => string;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  updateNoteText: (id: string, text: string) => void;
  createNoteFromVoiceNote?: (id: string) => void;
}

// Create context
const VoiceNotesContext = createContext<VoiceNotesContextValue>({
  notes: [],
  addNote: () => '',
  deleteNote: () => {},
  toggleNoteComplete: () => {},
  updateNoteText: () => {},
});

// Storage key
const VOICE_NOTES_STORAGE_KEY = 'voice-notes';

// Provider component
export const VoiceNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<VoiceNote[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(VOICE_NOTES_STORAGE_KEY);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error parsing saved voice notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem(VOICE_NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Add a new voice note
  const addNote = useCallback((text: string, audioUrl?: string, duration?: number): string => {
    const newNote: VoiceNote = {
      id: uuidv4(),
      text,
      audioUrl,
      timestamp: new Date().toISOString(),
      isComplete: false,
      duration,
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote.id;
  }, []);

  // Delete a voice note
  const deleteNote = useCallback((id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    toast.success('Voice note deleted');
  }, []);

  // Toggle complete status
  const toggleNoteComplete = useCallback((id: string) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, isComplete: !note.isComplete } 
          : note
      )
    );
  }, []);

  // Update note text
  const updateNoteText = useCallback((id: string, text: string) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, text } 
          : note
      )
    );
    toast.success('Voice note updated');
  }, []);

  // Listen for voice-note:create events
  useEvent('voice-note:create', (payload) => {
    addNote(payload.text, payload.audioUrl);
  });

  const value: VoiceNotesContextValue = {
    notes,
    addNote,
    deleteNote,
    toggleNoteComplete,
    updateNoteText,
  };

  return (
    <VoiceNotesContext.Provider value={value}>
      {children}
    </VoiceNotesContext.Provider>
  );
};

// Hook for accessing the context
export const useVoiceNotes = () => useContext(VoiceNotesContext);
