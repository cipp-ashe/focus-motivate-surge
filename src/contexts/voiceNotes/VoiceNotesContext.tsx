
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VoiceNote, VoiceNoteContextType } from '@/types/voiceNotes';
import { toast } from 'sonner';
import { useNoteActions } from '@/contexts/notes/NoteContext';
import { EntityType } from '@/types/core';
import { RelationType } from '@/types/state';
import { relationshipManager } from '@/lib/relationshipManager';

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

  const [lastCreatedNoteId, setLastCreatedNoteId] = useState<string | null>(null);
  const noteActions = useNoteActions();

  useEffect(() => {
    try {
      localStorage.setItem('voiceNotes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving voice notes:', error);
      toast.error('Failed to save voice notes');
    }
  }, [notes]);

  const addNote = (text: string, audioUrl?: string, duration?: number) => {
    const newNote: VoiceNote = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
      isComplete: false,
      audioUrl,
      duration,
    };
    
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote;
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

  const createNoteFromVoiceNote = (voiceNoteId: string) => {
    const voiceNote = notes.find(note => note.id === voiceNoteId);
    
    if (!voiceNote) {
      toast.error("Voice note not found");
      return;
    }

    // Create a new note with the voice note content
    try {
      const title = voiceNote.text.split('\n')[0].substring(0, 50) || 'Voice Note';
      const content = voiceNote.text;
      
      // Add the note - the function doesn't accept an object per the NoteActions interface
      const newNote = noteActions.addNote();
      
      if (newNote) {
        // If note was created successfully, update it with the voice note content
        noteActions.updateNote(newNote.id, content);
        
        // Store the created note ID for relationship creation
        const createdNoteId = newNote.id;
        
        // Link the voice note and regular note
        relationshipManager.createRelationship(
          voiceNoteId,
          EntityType.VoiceNote,
          createdNoteId,
          EntityType.Note,
          'source' as RelationType
        );
        
        toast.success("Created note from voice recording");
        
        // Mark voice note as complete
        toggleNoteComplete(voiceNoteId);
      } else {
        toast.error("Failed to create note");
      }
    } catch (error) {
      console.error("Failed to create note from voice note:", error);
      toast.error("Failed to create note");
    }
  };

  return (
    <VoiceNotesContext.Provider
      value={{ 
        notes, 
        addNote, 
        deleteNote, 
        toggleNoteComplete, 
        updateNoteText,
        createNoteFromVoiceNote
      }}
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
