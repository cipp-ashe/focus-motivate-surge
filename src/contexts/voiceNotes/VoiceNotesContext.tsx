
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VoiceNote, VoiceNoteContextType } from '@/types/voiceNotes';
import { toast } from 'sonner';

const VoiceNotesContext = createContext<VoiceNoteContextType | undefined>(undefined);

export const VoiceNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<VoiceNote[]>(() => {
    try {
      const savedNotes = localStorage.getItem('voiceNotes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error('Error loading voice notes:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('voiceNotes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving voice notes:', error);
      toast.error('Failed to save voice notes');
    }
  }, [notes]);

  const addNote = (text: string, audioUrl?: string, duration?: number) => {
    setNotes((prevNotes) => [
      {
        id: Date.now().toString(),
        text,
        timestamp: Date.now(),
        isComplete: false,
        audioUrl,
        duration,
      },
      ...prevNotes,
    ]);
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const toggleNoteComplete = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isComplete: !note.isComplete } : note
      )
    );
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, text } : note))
    );
  };

  return (
    <VoiceNotesContext.Provider
      value={{ notes, addNote, deleteNote, toggleNoteComplete, updateNoteText }}
    >
      {children}
    </VoiceNotesContext.Provider>
  );
};

export const useVoiceNotes = () => {
  const context = useContext(VoiceNotesContext);
  if (context === undefined) {
    throw new Error('useVoiceNotes must be used within a VoiceNotesProvider');
  }
  return context;
};
