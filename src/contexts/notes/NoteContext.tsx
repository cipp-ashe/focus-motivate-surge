
import React from 'react';
import { NoteContextProvider, useNoteActions, useNoteState } from './hooks';

// Re-export the hooks and provider
export { useNoteActions, useNoteState, NoteContextProvider };

// Main provider component
export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <NoteContextProvider>{children}</NoteContextProvider>;
};
