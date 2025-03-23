
import React from 'react';
import { NoteContextProvider, useNoteActions, useNoteState } from './hooks';
import { useEvent } from '@/hooks/useEvent';
import { EventType } from '@/lib/events/EventManager';

// Re-export the hooks and provider
export { useNoteActions, useNoteState, NoteContextProvider };

// Main provider component
export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set up event listeners for note-related events
  useEvent('note:create-from-habit' as EventType, (payload) => {
    console.log('Handling note creation from habit:', payload);
    // This event is handled elsewhere, but we could add additional handling here
  });
  
  // Handle voice note creation - add it to the event types
  useEvent('note:create-from-voice' as EventType, (payload) => {
    console.log('Handling note creation from voice:', payload);
    // This event is handled elsewhere, but we could add additional handling here
  });

  return <NoteContextProvider>{children}</NoteContextProvider>;
};
